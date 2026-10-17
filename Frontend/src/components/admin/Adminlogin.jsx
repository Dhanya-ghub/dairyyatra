import React, { useState } from 'react';
import { Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { login } from './adminApi';

export default function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-[#C8DFDB] bg-white text-sm focus:outline-none focus:ring-2 focus:border-[#3368A0] focus:ring-[#3368A0]/20';

  return (
    <div className="min-h-screen bg-[#F2EFE7] flex items-center justify-center px-4 font-sans text-[#172738]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl border border-[#C8DFDB] shadow-xl p-8 space-y-5"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#142538] text-[#C8DFDB] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-sans text-3xl font-bold">Admin Login</h1>
          <p className="text-sm text-[#4E657D]">Dairy Yatra 2027 · Selection Panel</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3368A0] mb-1.5">Username</label>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3368A0] mb-1.5">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="w-full flex items-center justify-center gap-2 bg-[#3368A0] hover:bg-[#234974] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-sm cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}