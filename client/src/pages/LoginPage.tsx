import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields.');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) return setError('Please enter a valid email address.');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left panel – image */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <Link to="/" className="font-serif text-3xl mb-auto pt-6">Traveloop<sup className="text-xs">®</sup></Link>
          <blockquote>
            <p className="font-serif text-2xl leading-snug mb-4">
              "The world is a book, and those who do not travel read only one page."
            </p>
            <cite className="font-sans text-sm text-white/70">— Saint Augustine</cite>
          </blockquote>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link to="/" className="font-serif text-2xl text-foreground lg:hidden">
              Traveloop<sup className="text-xs">®</sup>
            </Link>
            <h1 className="font-serif text-4xl font-normal mt-4" style={{ letterSpacing: '-1px' }}>
              Welcome back
            </h1>
            <p className="font-sans text-muted text-sm mt-2">
              Sign in to continue planning your adventures.
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-sans text-foreground mb-2" htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-foreground/20 bg-background font-sans text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-sans text-foreground mb-2" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-foreground/20 bg-background font-sans text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="w-full rounded-xl px-6 py-4 text-sm font-sans bg-foreground text-background hover:bg-foreground/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-foreground/10" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted">Or review as judge</span></div>
            </div>

            <button
              type="button"
              onClick={() => {
                setForm({ email: 'test@traveloop.com', password: 'password123' });
                // We'll let the user click sign in manually or auto-submit
                setTimeout(() => document.getElementById('login-submit')?.click(), 100);
              }}
              className="w-full rounded-xl px-6 py-4 text-sm font-sans border border-foreground/20 hover:bg-foreground/5 transition flex items-center justify-center gap-2"
            >
              🚀 Login as Hackathon Judge
            </button>
          </form>

          <p className="mt-8 text-center font-sans text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
