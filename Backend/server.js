import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// ============================================================
// CONFIG (fail fast if anything critical is missing)
// ============================================================

const REQUIRED_ENV = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`CRITICAL: missing environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const SEAT_LIMIT = parseInt(process.env.SEAT_LIMIT || '35', 10);

// EOI window: 12 Oct 2026 to 12 Nov 2026 (IST). Override in .env for testing.
const EOI_OPENS = new Date(process.env.EOI_OPENS_AT || '2026-10-12T00:00:00+05:30');
const EOI_CLOSES = new Date(process.env.EOI_CLOSES_AT || '2026-11-12T23:59:59+05:30');

// Comma-separated list of allowed frontend origins
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const VALID_STATUSES = ['SUBMITTED', 'SHORTLISTED', 'WAITLISTED', 'REJECTED'];
const GENDERS = ['Male', 'Female', 'Other'];

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ============================================================
// APP + MIDDLEWARE
// ============================================================

const app = express();
// 1 = one reverse proxy (Caddy/nginx) sits in front. Set TRUST_PROXY=0 if Node is exposed directly,
// otherwise visitors could fake their IP address and get around the rate limits.
app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 1));
// CSP is switched off because this server also serves the website (fonts, inline styles, videos).
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin(origin, cb) {
      // allow tools like curl/Postman (no origin) and the listed frontends
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json({ limit: '100kb' }));

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'RATE_LIMITED', message: 'Too many attempts. Please try again in a few minutes.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

// ============================================================
// HELPERS
// ============================================================

function calculateAge(dobString) {
  if (!dobString) return null;
  const birth = new Date(dobString);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// Always returns a trimmed string ('' if the value is not a string)
const str = (v) => (typeof v === 'string' ? v.trim() : '');

const digitsOnly = (v) => str(v).replace(/\D/g, '');

function generateApplicationId() {
  return `DY-2027-${crypto.randomInt(100000, 1000000)}`;
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// ============================================================
// VALIDATION (mirrors the frontend rules)
// ============================================================

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSubmission(d) {
  const e = {};

  const fullName = str(d.fullName);
  if (fullName.length < 3 || fullName.length > 100) e.fullName = 'Enter your name as per Aadhar';

  const age = calculateAge(d.dob);
  if (age === null || age < 18 || age > 100) e.dob = 'Enter a valid date of birth (18+ only)';

  if (!GENDERS.includes(d.gender)) e.gender = 'Select your gender';

  if (!PHONE.test(digitsOnly(d.whatsapp))) e.whatsapp = 'Enter a valid 10-digit WhatsApp number';

  if (str(d.secondaryNo) && !PHONE.test(digitsOnly(d.secondaryNo)))
    e.secondaryNo = 'Enter a valid 10-digit number or leave it empty';

  const email = str(d.email);
  if (email && (!EMAIL.test(email) || email.length > 150)) e.email = 'Enter a valid email address or leave it empty';

  const address = str(d.address);
  if (address.length < 10 || address.length > 500) e.address = 'Enter your residential address';

  if (!str(d.city) || str(d.city).length > 100) e.city = 'City is required';
  if (!str(d.state) || str(d.state).length > 100) e.state = 'State is required';
  if (!str(d.occupation) || str(d.occupation).length > 100) e.occupation = 'Occupation is required';
  if (str(d.organization).length > 150) e.organization = 'Organization name is too long';

  const prior = str(d.priorExperience);
  if (prior.length < 3 || prior.length > 3000) e.priorExperience = 'Required (write "None" if you have no experience)';

  const motivation = str(d.motivation);
  if (motivation.length < 30 || motivation.length > 3000)
    e.motivation = 'Please write at least 30 characters about your motivation';

  const learning = str(d.learningExpectations);
  if (learning.length < 30 || learning.length > 3000)
    e.learningExpectations = 'Please write at least 30 characters about your learning expectations';

  return { isValid: Object.keys(e).length === 0, errors: e };
}

// ============================================================
// MAPPERS
// ============================================================

function mapApplicationToDatabase(f) {
  return {
    application_id: generateApplicationId(),
    status: 'SUBMITTED',
    full_name: str(f.fullName),
    dob: f.dob,
    gender: f.gender,
    whatsapp: digitsOnly(f.whatsapp),
    secondary_no: digitsOnly(f.secondaryNo) || null,
    email: str(f.email).toLowerCase() || null, // optional: many applicants have no email
    address: str(f.address),
    city: str(f.city),
    state: str(f.state),
    occupation: str(f.occupation),
    organization: str(f.organization) || null,
    prior_experience: str(f.priorExperience),
    motivation: str(f.motivation),
    learning_expectations: str(f.learningExpectations),
  };
}

function mapDatabaseToFrontend(row) {
  return {
    refId: row.application_id,
    timestamp: row.submitted_at,
    formattedDate: row.submitted_at
      ? new Date(row.submitted_at).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' })
      : '',
    status: row.status,
    adminNotes: row.admin_notes,
    data: {
      fullName: row.full_name,
      dob: row.dob,
      age: calculateAge(row.dob),
      gender: row.gender,
      whatsapp: row.whatsapp,
      secondaryNo: row.secondary_no,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      occupation: row.occupation,
      organization: row.organization,
      priorExperience: row.prior_experience,
      motivation: row.motivation,
      learningExpectations: row.learning_expectations,
    },
  };
}

// ============================================================
// HEALTH
// ============================================================

app.get('/api/health', (req, res) => {
  const now = new Date();
  res.json({
    success: true,
    message: 'Dairy Yatra API is running',
    time: now.toISOString(),
    eoiOpen: now >= EOI_OPENS && now <= EOI_CLOSES,
    eoiOpensAt: EOI_OPENS.toISOString(),
    eoiClosesAt: EOI_CLOSES.toISOString(),
  });
});

// ============================================================
// PUBLIC: SUBMIT EXPRESSION OF INTEREST
// ============================================================

app.post('/api/submissions', submitLimiter, async (req, res) => {
  const { formData } = req.body || {};

  if (!formData || typeof formData !== 'object') {
    return res.status(400).json({ error: 'Form data is required' });
  }

  // 1. EOI window (decided by the server clock, not the browser)
  const now = new Date();
  if (now < EOI_OPENS) {
    return res.status(403).json({ error: 'EOI_NOT_OPEN', message: 'Expression of Interest opens on 12 October 2026.' });
  }
  if (now > EOI_CLOSES) {
    return res.status(403).json({ error: 'EOI_CLOSED', message: 'Expression of Interest closed on 12 November 2026.' });
  }

  // 2. Validation
  const { isValid, errors } = validateSubmission(formData);
  if (!isValid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  // 3. Insert (retry only if the random reference ID collides)
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await supabase
        .from('eoi_applications')
        .insert([mapApplicationToDatabase(formData)])
        .select('*')
        .single();

      if (!error) {
        return res.status(201).json({ success: true, submissionRecord: mapDatabaseToFrontend(data) });
      }

      if (error.code === '23505') {
        const msg = `${error.message} ${error.details || ''}`;
        if (msg.includes('application_id')) continue; // ID collision, try again
        return res.status(409).json({
          error: 'DUPLICATE',
          message: 'An application with this WhatsApp number or email already exists.',
        });
      }

      throw error;
    }

    throw new Error('Could not generate a unique application ID');
  } catch (err) {
    console.error('Submit error:', err.code, err.message);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Submission failed. Please try again.' });
  }
});

// ============================================================
// ADMIN AUTH
// ============================================================

function authenticateAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { username, password } = req.body || {};

  const ok =
    typeof username === 'string' &&
    typeof password === 'string' &&
    safeEqual(username, process.env.ADMIN_USERNAME) &&
    safeEqual(password, process.env.ADMIN_PASSWORD);

  if (!ok) return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
  return res.json({ token });
});

// ============================================================
// ADMIN: LIST
// ============================================================

app.get('/api/admin/submissions', authenticateAdmin, async (req, res) => {
  const { search, status, sort } = req.query;

  try {
    let query = supabase
      .from('eoi_applications')
      .select('id, application_id, full_name, email, whatsapp, secondary_no, city, state, occupation, status, submitted_at');

    if (typeof search === 'string' && search.trim()) {
      // strip characters that have meaning inside a PostgREST .or() filter
      const s = search.replace(/[,()%*\\]/g, ' ').trim().slice(0, 60);
      if (s) {
        query = query.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,application_id.ilike.%${s}%,whatsapp.ilike.%${s}%`);
      }
    }

    if (typeof status === 'string' && VALID_STATUSES.includes(status)) {
      query = query.eq('status', status);
    }

    query = query.order('submitted_at', { ascending: sort === 'asc' });

    const { data, error } = await query;
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Admin list error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve applications' });
  }
});

// ============================================================
// ADMIN: SINGLE APPLICATION
// ============================================================

app.get('/api/admin/submissions/:refId', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('eoi_applications')
      .select('*')
      .eq('application_id', req.params.refId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Application not found' });
    return res.json(mapDatabaseToFrontend(data));
  } catch (err) {
    console.error('Admin get error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve application' });
  }
});

// ============================================================
// ADMIN: UPDATE STATUS / NOTES (with seat cap on SHORTLISTED)
// ============================================================

app.patch('/api/admin/submissions/:refId/status', authenticateAdmin, async (req, res) => {
  const { status, adminNotes } = req.body || {};

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const { data: current, error: findErr } = await supabase
      .from('eoi_applications')
      .select('status')
      .eq('application_id', req.params.refId)
      .maybeSingle();

    if (findErr) throw findErr;
    if (!current) return res.status(404).json({ error: 'Application not found' });

    // Enforce the cohort seat limit
    if (status === 'SHORTLISTED' && current.status !== 'SHORTLISTED') {
      const { count, error: countErr } = await supabase
        .from('eoi_applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'SHORTLISTED');
      if (countErr) throw countErr;
      if (count >= SEAT_LIMIT) {
        return res.status(400).json({
          error: 'SEAT_LIMIT_REACHED',
          message: `Seat limit of ${SEAT_LIMIT} reached. Move someone out of SHORTLISTED first.`,
        });
      }
    }

    const update = { updated_at: new Date().toISOString() };
    if (status !== undefined) update.status = status;
    if (adminNotes !== undefined) update.admin_notes = typeof adminNotes === 'string' ? adminNotes.slice(0, 2000) : null;

    const { data, error } = await supabase
      .from('eoi_applications')
      .update(update)
      .eq('application_id', req.params.refId)
      .select('*')
      .single();

    if (error) throw error;
    return res.json({ success: true, submissionRecord: mapDatabaseToFrontend(data) });
  } catch (err) {
    console.error('Admin status error:', err.message);
    return res.status(500).json({ error: 'Failed to update application status' });
  }
});

// ============================================================
// SERVE THE BUILT WEBSITE (Frontend/dist) FROM THIS SAME SERVER
// ============================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = process.env.FRONTEND_DIST || path.resolve(__dirname, '../Frontend/dist');

if (fs.existsSync(path.join(DIST, 'index.html'))) {
  app.use(express.static(DIST));
  // any non-API address (/, /admin, ...) returns the single-page app
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(DIST, 'index.html')));
  console.log(`Serving website from ${DIST}`);
} else {
  console.log(`No built website found at ${DIST} (run "npm run build" in the Frontend folder). API only.`);
}

// ============================================================
// 404 + ERROR HANDLER
// ============================================================

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ error: 'Origin not allowed' });
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Server error' });
});

// ============================================================
// START
// ============================================================

app.listen(PORT, () => {
  console.log(`Dairy Yatra API running on port ${PORT}`);
  console.log(`EOI window: ${EOI_OPENS.toISOString()} to ${EOI_CLOSES.toISOString()}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});