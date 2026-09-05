'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  User,
  Key,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('operator.verma');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('Command Center Operator');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-[0_0_50px_rgba(0,240,255,0.08)] backdrop-blur-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-950 to-indigo-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-slate-100 uppercase">
            IBVAP
          </h1>
          <p className="text-xs text-slate-400 tracking-wide font-medium">
            Intelligent Border Video Analytics Platform
          </p>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            <Lock className="w-2.5 h-2.5" /> SECURE DEFENSE ACCESS PORTAL
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-numbers">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 font-sans">
              Operator Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="operator.id"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono-numbers"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 font-sans">
              Access Token / Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 font-sans">
              Operational Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs"
            >
              <option value="Command Center Operator">Command Center Operator</option>
              <option value="Sector Watch Commander">Sector Watch Commander</option>
              <option value="QRT Field Dispatch Lead">QRT Field Dispatch Lead</option>
              <option value="Intelligence Analyst">Intelligence Analyst</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black tracking-wide text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all font-sans"
          >
            {loading ? (
              <span>AUTHENTICATING OPERATOR...</span>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" /> AUTHORIZE SECURE ENTRY <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Notice */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 text-center space-y-1 font-sans">
          <span className="font-semibold text-cyan-400">Prototype Demo Credentials Pre-Filled</span>
          <p className="text-[10px] text-slate-500">
            Click &quot;Authorize Secure Entry&quot; to directly access the operational command center.
          </p>
        </div>
      </div>
    </div>
  );
}
