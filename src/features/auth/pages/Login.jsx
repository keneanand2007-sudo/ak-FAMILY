import { useState } from 'react';
import { UserRound } from 'lucide-react';
import { useAuthStore } from '../store';

export default function Login({ onSwitchToSignup, onLoginSuccess }) {
  const login = useAuthStore((state) => state.login);
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.message);
      }
    }, 400);
  };

  const handleGuest = () => {
    loginAsGuest();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-xl mb-4 shadow-md shadow-blue-200">
            F
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">FAMILY OS</h1>
          <p className="text-slate-500 text-sm mt-1">Your Family. One Secure Space.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Password"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium transition shadow-md shadow-blue-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleGuest}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium transition"
          >
            <UserRound size={15} /> Continue as Guest (skip login)
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have a family workspace?{' '}
          <button onClick={onSwitchToSignup} className="text-blue-600 hover:text-blue-700 font-medium">
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
