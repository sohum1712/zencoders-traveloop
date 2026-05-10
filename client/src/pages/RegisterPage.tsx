import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      return setError('Please fill in all required fields.');
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) return setError('Please enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (
    id: string,
    label: string,
    key: keyof typeof form,
    type = 'text',
    placeholder = '',
    autoComplete = ''
  ) => (
    <div>
      <label className="block text-sm font-sans text-foreground mb-2" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-3.5 rounded-xl border border-foreground/20 bg-background font-sans text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex font-sans">
      {/* Image panel */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <Link to="/" className="font-serif text-3xl mb-auto pt-6">Traveloop<sup className="text-xs">®</sup></Link>
          <p className="font-serif text-2xl leading-snug mb-2">
            "To travel is to live."
          </p>
          <cite className="font-sans text-sm text-white/70">— Hans Christian Andersen</cite>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="font-serif text-2xl text-foreground lg:hidden">
              Traveloop<sup className="text-xs">®</sup>
            </Link>
            <h1 className="font-serif text-4xl font-normal mt-4" style={{ letterSpacing: '-1px' }}>
              Start your journey
            </h1>
            <p className="font-sans text-muted text-sm mt-2">
              Create a free account and plan your first trip today.
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {field('reg-firstname', 'First name', 'firstName', 'text', 'Jane', 'given-name')}
              {field('reg-lastname', 'Last name', 'lastName', 'text', 'Doe', 'family-name')}
            </div>
            {field('reg-email', 'Email address', 'email', 'email', 'you@example.com', 'email')}
            {field('reg-password', 'Password', 'password', 'password', '6+ characters', 'new-password')}
            {field('reg-confirm', 'Confirm password', 'confirmPassword', 'password', 'Repeat password', 'new-password')}

            <button
              type="submit"
              disabled={loading}
              id="register-submit"
              className="w-full rounded-xl px-6 py-4 text-sm font-sans bg-foreground text-background hover:bg-foreground/90 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p className="mt-8 text-center font-sans text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
