import React, { useState, useCallback } from 'react';
import AdminLogin from './Adminlogin';
import AdminDashboard from './Admindashboard';
import { getToken, clearToken } from './adminApi';

export default function AdminPortal() {
  const [authed, setAuthed] = useState(() => !!getToken());

  const handleLogout = useCallback(() => {
    clearToken();
    setAuthed(false);
  }, []);

  return authed ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onSuccess={() => setAuthed(true)} />
  );
}