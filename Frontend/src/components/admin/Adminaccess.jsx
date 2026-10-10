import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Lock, X } from 'lucide-react';

// Loaded only when the link is clicked, so the admin screens stay out of the public bundle
const AdminPortal = lazy(() => import('./Adminportal'));

const DEFAULT_BUTTON =
  'inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#94A3B8] hover:text-[#3368A0] transition-colors cursor-pointer';

/*
  Drop <AdminAccess /> anywhere (it is used in the header nav).
  - Pass className to style the link so it matches its surroundings.
  - Clicking opens the admin area full screen; AdminPortal asks for the username and password.
  - The real protection is on the server: every /api/admin route rejects requests without a valid token.
*/
export default function AdminAccess({ className, label = 'Admin login', iconOnly = false }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // stop the page behind from scrolling
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const overlay = (
    <div className="fixed inset-0 z-[100] bg-[#F2EFE7] overflow-y-auto">
      <div className="sticky top-0 z-[110] bg-[#0f1c2c] text-white text-xs px-4 py-2 flex items-center justify-between">
        <span className="font-bold uppercase tracking-widest text-[#C8DFDB]">Admin area</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex items-center gap-1.5 font-bold hover:text-[#C8DFDB] cursor-pointer"
        >
          <X className="w-4 h-4" /> Close
        </button>
      </div>

      <Suspense
        fallback={<div className="min-h-[60vh] flex items-center justify-center text-sm text-[#4E657D]">Loading...</div>}
      >
        <AdminPortal />
      </Suspense>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className || DEFAULT_BUTTON}
        aria-label={label}
        title={label}
      >
        <Lock className={iconOnly ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        {!iconOnly && <span>{label}</span>}
      </button>

      {/* Portal: render at page level so a sticky/blurred header cannot trap the full-screen overlay */}
      {open && createPortal(overlay, document.body)}
    </>
  );
}