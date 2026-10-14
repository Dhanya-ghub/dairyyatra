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
// Our own Postgres (in Docker) instead of Supabase. See db.js for how the connection works.
import { query, withTransaction } from './db.js';

dotenv.config();

// ============================================================
// CONFIG (fail fast if anything critical is missing)
// ============================================================

const REQUIRED_ENV = [
  'DATABASE_URL', // was SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
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

// Names of the unique rules in db/init/01_schema.sql. When an INSERT breaks one, Postgres tells us
// which one in err.constraint, so we no longer have to search the error message text.
const UNIQUE_APPLICATION_ID = 'eoi_applications_application_id_key';

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

  // Optional: these three may be empty. Only the maximum length is checked.
  if (str(d.priorExperience).length > 3000) e.priorExperience = 'Please keep this under 3000 characters';
  if (str(d.motivation).length > 3000) e.motivation = 'Please keep this under 3000 characters';
  if (str(d.learningExpectations).length > 3000) e.learningExpectations = 'Please keep this under 3000 characters';

  if (!['Yes', 'No'].includes(d.wantsScholarship)) e.wantsScholarship = 'Select Yes or No';
  const scholarshipReason = str(d.scholarshipReason);
  if (d.wantsScholarship === 'Yes' && (!scholarshipReason || scholarshipReason.length > 3000))
    e.scholarshipReason = 'Tell us why you are applying for a scholarship';

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
    wants_scholarship: f.wantsScholarship === 'Yes',
    scholarship_reason: f.wantsScholarship === 'Yes' ? str(f.scholarshipReason).trim() : null,
    // optional answers: saved as null when left empty
    prior_experience: str(f.priorExperience) || null,
    motivation: str(f.motivation) || null,
    learning_expectations: str(f.learningExpectations) || null,
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
      wantsScholarship: row.wants_scholarship ? 'Yes' : 'No',
      scholarshipReason: row.scholarship_reason,
      priorExperience: row.prior_experience,
      motivation: row.motivation,
      learningExpectations: row.learning_expectations,
    },
  };
}

// ============================================================
// HEALTH
// ============================================================

app.get('/api/health', async (req, res) => {
  const now = new Date();
  // Also check the database answers, so Docker (or you) can tell when it is down
  let database = true;
  try {
    await query('SELECT 1');
  } catch {
    database = false;
  }
  res.status(database ? 200 : 503).json({
    success: database,
    message: database ? 'Dairy Yatra API is running' : 'Database is not reachable',
    database,
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
      // Was: supabase.from('eoi_applications').insert([row]).select('*').single()
      // Now: one INSERT ... RETURNING *  (RETURNING sends the saved row back, like .select('*'))
      const row = mapApplicationToDatabase(formData);
      const columns = Object.keys(row); // fixed list from our own mapper, never from the visitor
      const values = Object.values(row);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', '); // $1, $2, $3 ...

      try {
        const { rows } = await query(
          `INSERT INTO eoi_applications (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
          values
        );
        return res.status(201).json({ success: true, submissionRecord: mapDatabaseToFrontend(rows[0]) });
      } catch (error) {
        // 23505 = "unique rule broken" (same code Supabase passed on, because it is Postgres underneath)
        if (error.code === '23505') {
          if (error.constraint === UNIQUE_APPLICATION_ID) continue; // random ID collided: try a new one
          return res.status(409).json({
            error: 'DUPLICATE',
            message: 'An application with this WhatsApp number or email already exists.',
          });
        }
        throw error;
      }
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
    // Was: supabase.from(...).select(...).or(...ilike...).eq('status', ...).order('submitted_at')
    // Now: we build the WHERE part step by step. Every visitor value goes into `params`
    // and is referred to as $1, $2 ... so it can never change the SQL itself.
    const where = [];
    const params = [];

    if (typeof search === 'string' && search.trim()) {
      const s = search.trim().slice(0, 60);
      // In ILIKE, % and _ are wildcards; put a \ in front so a typed % or _ is searched literally
      params.push(`%${s.replace(/[\\%_]/g, '\\$&')}%`);
      const p = `$${params.length}`;
      where.push(`(full_name ILIKE ${p} OR email ILIKE ${p} OR application_id ILIKE ${p} OR whatsapp ILIKE ${p})`);
    }

    if (typeof status === 'string' && VALID_STATUSES.includes(status)) {
      params.push(status);
      where.push(`status = $${params.length}`);
    }

    // The sort direction is chosen by us (ASC or DESC), never copied from the visitor
    const direction = sort === 'asc' ? 'ASC' : 'DESC';

    const { rows } = await query(
      `SELECT id, application_id, full_name, email, whatsapp, secondary_no, city, state, occupation, status, submitted_at
         FROM eoi_applications
         ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
         ORDER BY submitted_at ${direction}`,
      params
    );
    return res.json(rows);
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
    // Was: supabase.from(...).select('*').eq('application_id', refId).maybeSingle()
    const { rows } = await query('SELECT * FROM eoi_applications WHERE application_id = $1', [req.params.refId]);
    if (!rows[0]) return res.status(404).json({ error: 'Application not found' });
    return res.json(mapDatabaseToFrontend(rows[0]));
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
    // Was: three separate Supabase calls (find -> count shortlisted -> update).
    // Now: the same three steps as SQL, inside ONE transaction. The advisory lock makes two admins
    // clicking "Shortlist" at the same moment wait for each other, so the seat limit can't be overshot.
    const result = await withTransaction(async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtext('eoi_shortlist'))");

      const found = await client.query('SELECT status FROM eoi_applications WHERE application_id = $1', [
        req.params.refId,
      ]);
      const current = found.rows[0];
      if (!current) return { notFound: true };

      // Enforce the cohort seat limit
      if (status === 'SHORTLISTED' && current.status !== 'SHORTLISTED') {
        const counted = await client.query(
          "SELECT COUNT(*)::int AS count FROM eoi_applications WHERE status = 'SHORTLISTED'"
        );
        if (counted.rows[0].count >= SEAT_LIMIT) return { seatLimit: true };
      }

      // Only these two columns can ever be changed here. updated_at (and shortlisted_at) are set
      // automatically by the database trigger eoi_before_update_trg.
      const sets = [];
      const params = [];
      if (status !== undefined) {
        params.push(status);
        sets.push(`status = $${params.length}`);
      }
      if (adminNotes !== undefined) {
        params.push(typeof adminNotes === 'string' ? adminNotes.slice(0, 2000) : null);
        sets.push(`admin_notes = $${params.length}`);
      }
      if (!sets.length) sets.push('updated_at = now()'); // nothing to change: just "touch" the row

      params.push(req.params.refId);
      const updated = await client.query(
        `UPDATE eoi_applications SET ${sets.join(', ')} WHERE application_id = $${params.length} RETURNING *`,
        params
      );
      return { row: updated.rows[0] };
    });

    if (result.notFound) return res.status(404).json({ error: 'Application not found' });
    if (result.seatLimit) {
      return res.status(400).json({
        error: 'SEAT_LIMIT_REACHED',
        message: `Seat limit of ${SEAT_LIMIT} reached. Move someone out of SHORTLISTED first.`,
      });
    }
    return res.json({ success: true, submissionRecord: mapDatabaseToFrontend(result.row) });
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
  // Check the database once at start-up, so a wrong DATABASE_URL shows up immediately
  query('SELECT 1')
    .then(() => console.log('Connected to Postgres'))
    .catch((err) => console.error('Could not connect to Postgres:', err.message));
});