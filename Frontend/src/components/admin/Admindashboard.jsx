import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { LogOut, RefreshCw, Search, Download, X, AlertCircle } from 'lucide-react';
import { fetchApplications, fetchApplication, updateApplication, AuthError } from './adminApi';

const STATUSES = ['SUBMITTED', 'SHORTLISTED', 'WAITLISTED', 'REJECTED'];

// Display only. The real limit is enforced by the server (SEAT_LIMIT in the backend .env, default 35).
const SEAT_LIMIT = 35;

const STATUS_LABEL = {
  SUBMITTED: 'Submitted',
  SHORTLISTED: 'Shortlisted',
  WAITLISTED: 'Waitlisted',
  REJECTED: 'Rejected',
};

const STATUS_BADGE = {
  SUBMITTED: 'bg-slate-100 text-slate-700 border-slate-300',
  SHORTLISTED: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  WAITLISTED: 'bg-amber-50 text-amber-700 border-amber-300',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-300',
};

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

function Badge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[status] || ''}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

// CSV export of the currently filtered list (cells starting with = + - @ are neutralised)
function exportCsv(rows) {
  const cols = [
    ['Reference', 'application_id'],
    ['Name', 'full_name'],
    ['Email', 'email'],
    ['WhatsApp', 'whatsapp'],
    ['Secondary number', 'secondary_no'],
    ['City', 'city'],
    ['State', 'state'],
    ['Occupation', 'occupation'],
    ['Status', 'status'],
    ['Submitted', 'submitted_at'],
  ];
  const clean = (v) => {
    let s = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [
    cols.map((c) => clean(c[0])).join(','),
    ...rows.map((r) => cols.map((c) => clean(r[c[1]])).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dairy-yatra-eoi-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard({ onLogout }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [openRef, setOpenRef] = useState(null);
  const [record, setRecord] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  // Returns true if it was an expired-session error (and logs out)
  const handleAuth = useCallback(
    (err) => {
      if (err instanceof AuthError) {
        onLogout();
        return true;
      }
      return false;
    },
    [onLogout]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setApps(await fetchApplications());
    } catch (err) {
      if (!handleAuth(err)) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [handleAuth]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { ALL: apps.length };
    STATUSES.forEach((s) => (c[s] = apps.filter((a) => a.status === s).length));
    return c;
  }, [apps]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (!q) return true;
      return [a.full_name, a.email, a.whatsapp, a.application_id, a.city, a.occupation]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [apps, search, statusFilter]);

  const openDetail = async (refId) => {
    setOpenRef(refId);
    setRecord(null);
    setActionError('');
    try {
      const r = await fetchApplication(refId);
      setRecord(r);
      setNotes(r.adminNotes || '');
    } catch (err) {
      if (!handleAuth(err)) setActionError(err.message);
    }
  };

  const closeDetail = () => {
    setOpenRef(null);
    setRecord(null);
    setActionError('');
  };

  const save = async (payload, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setSaving(true);
    setActionError('');
    try {
      const res = await updateApplication(openRef, payload);
      setRecord(res.submissionRecord);
      if (payload.status) {
        setApps((prev) =>
          prev.map((a) => (a.application_id === openRef ? { ...a, status: payload.status } : a))
        );
      }
    } catch (err) {
      if (!handleAuth(err)) setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const d = record?.data;
  const detailRows = d
    ? [
        ['Name (as per Aadhar)', d.fullName],
        ['Date of birth', `${d.dob || '—'}${d.age != null ? ` (${d.age} years)` : ''}`],
        ['Gender', d.gender],
        ['WhatsApp', d.whatsapp],
        ['Secondary number', d.secondaryNo],
        ['Email', d.email || 'Not provided'],
        ['Address', [d.address, d.city, d.state].filter(Boolean).join(', ')],
        ['Occupation', d.occupation],
        ['Organization', d.organization],
        ['Scholarship requested', d.wantsScholarship],
        ...(d.wantsScholarship === 'Yes' ? [['Scholarship reason', d.scholarshipReason]] : []),
        ['Prior dairy experience', d.priorExperience],
        ['Motivation', d.motivation],
        ['Learning expectations', d.learningExpectations],
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F2EFE7] text-[#172738] font-sans">
      {/* Header */}
      <header className="bg-[#142538] text-white border-b border-[#3368A0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div>
            <span className="font-serif text-xl font-bold">DAIRY YATRA 2027</span>
            <span className="ml-3 text-[10px] uppercase tracking-widest font-bold text-[#C8DFDB]">Selection Panel</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-white/30 hover:bg-white/15 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stat cards (click to filter) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[['ALL', 'Total'], ...STATUSES.map((s) => [s, STATUS_LABEL[s]])].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                statusFilter === key
                  ? 'bg-[#3368A0] text-white border-[#3368A0] shadow-lg'
                  : 'bg-white border-[#C8DFDB] hover:border-[#3368A0]/60'
              }`}
            >
              <div className="text-2xl font-bold">{counts[key] ?? 0}</div>
              <div className={`text-xs font-semibold uppercase tracking-wider ${statusFilter === key ? 'text-white/80' : 'text-[#4E657D]'}`}>
                {label}
              </div>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#4E657D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, WhatsApp, reference, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C8DFDB] bg-white text-sm focus:outline-none focus:ring-2 focus:border-[#3368A0] focus:ring-[#3368A0]/20"
            />
          </div>
          <button
            onClick={load}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#C8DFDB] bg-white text-sm font-bold hover:bg-[#E5E1D5] cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={() => exportCsv(filtered)}
            disabled={!filtered.length}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#C8DFDB] bg-white text-sm font-bold hover:bg-[#E5E1D5] disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#C8DFDB] shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-[#F2EFE7] text-xs uppercase tracking-wider text-[#3368A0]">
              <tr>
                <th className="text-left px-4 py-3">Reference</th>
                <th className="text-left px-4 py-3">Applicant</th>
                <th className="text-left px-4 py-3">WhatsApp</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Occupation</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading && !apps.length ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-[#4E657D]">Loading applications...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-[#4E657D]">No applications found.</td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => openDetail(a.application_id)}
                    className="border-t border-[#C8DFDB]/60 hover:bg-[#F2EFE7]/60 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{a.application_id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{a.full_name}</div>
                      <div className="text-xs text-[#4E657D]">{a.email || 'No email'}</div>
                    </td>
                    <td className="px-4 py-3">{a.whatsapp}</td>
                    <td className="px-4 py-3">{[a.city, a.state].filter(Boolean).join(', ')}</td>
                    <td className="px-4 py-3">{a.occupation}</td>
                    <td className="px-4 py-3"><Badge status={a.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">{fmtDate(a.submitted_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#4E657D]">
          Showing {filtered.length} of {apps.length} applications. Shortlisted: {counts.SHORTLISTED} / {SEAT_LIMIT} seats.
        </p>
      </main>

      {/* Detail panel */}
      {openRef && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeDetail} />
          <aside className="relative w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-[#C8DFDB] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <div className="font-mono text-xs text-[#4E657D]">{openRef}</div>
                <div className="font-serif text-xl font-bold">{d?.fullName || 'Loading...'}</div>
              </div>
              <button onClick={closeDetail} className="p-2 rounded-lg hover:bg-[#F2EFE7] cursor-pointer" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {actionError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> <span>{actionError}</span>
                </div>
              )}

              {!record ? (
                !actionError && <p className="text-sm text-[#4E657D]">Loading application...</p>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3368A0]">Status</span>
                    <Badge status={record.status} />
                  </div>

                  {/* Decision buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        disabled={saving || record.status === s}
                        onClick={() =>
                          save(
                            { status: s, adminNotes: notes },
                            s === 'REJECTED' ? `Reject ${d.fullName}?` : null
                          )
                        }
                        className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer disabled:cursor-not-allowed ${
                          record.status === s
                            ? 'bg-[#3368A0] text-white border-[#3368A0] opacity-90'
                            : 'bg-white border-[#C8DFDB] hover:bg-[#F2EFE7] disabled:opacity-50'
                        }`}
                      >
                        {s === 'SUBMITTED' ? 'Reset to Submitted' : STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>

                  {/* Answers */}
                  <dl className="divide-y divide-[#C8DFDB]/60 border border-[#C8DFDB] rounded-2xl">
                    {detailRows.map(([label, value]) => (
                      <div key={label} className="px-4 py-3">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#3368A0]">{label}</dt>
                        <dd className="text-sm mt-0.5 whitespace-pre-wrap break-words">{value || '—'}</dd>
                      </div>
                    ))}
                  </dl>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3368A0] mb-1.5">
                      Admin notes (private)
                    </label>
                    <textarea
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#C8DFDB] text-sm focus:outline-none focus:ring-2 focus:border-[#3368A0] focus:ring-[#3368A0]/20"
                    />
                    <button
                      disabled={saving}
                      onClick={() => save({ adminNotes: notes })}
                      className="mt-2 px-5 py-2 rounded-xl bg-[#3368A0] hover:bg-[#234974] text-white text-sm font-bold disabled:opacity-60 cursor-pointer"
                    >
                      {saving ? 'Saving...' : 'Save notes'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}