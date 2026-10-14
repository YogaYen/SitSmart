import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, Briefcase, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Software Engineer',
    org: 'TechCorp'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await loginUser(formData.email, formData.password);
      } else {
        data = await registerUser(formData);
      }
      if (onAuthSuccess && data && data.user) {
        onAuthSuccess(data.user);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser('alex@sitsmart.com', 'demo123');
      if (onAuthSuccess && data && data.user) {
        onAuthSuccess(data.user);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel-glow max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isLogin ? "Sign In to SitSmart" : "Create Ergonomic Account"}
              </h3>
              <p className="text-[11px] text-slate-400">Save daily posture history &amp; track progress</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/40">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer text-center border-b-2 ${
              isLogin
                ? 'border-brand-400 text-brand-300 bg-brand-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer text-center border-b-2 ${
              !isLogin
                ? 'border-brand-400 text-brand-300 bg-brand-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2.5 shadow-lg">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{error}</span>
                {isLogin && error.toLowerCase().includes('invalid') && (
                  <span className="block mt-1 text-[11px] text-slate-300">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsLogin(false); setError(null); }}
                      className="text-brand-300 hover:text-brand-200 underline font-semibold cursor-pointer"
                    >
                      Create one now
                    </button>{' '}
                    or use the 1-Click Demo below.
                  </span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Morgan"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Occupation</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Software Engineer"
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Organization</label>
                    <input
                      type="text"
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      placeholder="TechCorp"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@sitsmart.com"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isLogin ? "Sign In to Dashboard" : "Register & Begin Tracking"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-brand-500/40 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1-Click Demo Account (Alex Morgan)</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Pre-loaded with 4 days of posture improvement analytics &amp; stats.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
