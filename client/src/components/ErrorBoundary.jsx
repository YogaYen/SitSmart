import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SitSmart ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = 'dashboard';
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = 'landing';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-slate-900 border border-rose-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Something went wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                SitSmart encountered a client-side display error. No posture data was lost. You can reload the workstation or return to the home screen.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 max-h-36 overflow-y-auto">
                <span className="font-bold text-rose-400 block mb-1">Error Diagnostic:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Reload Workstation
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" /> Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
