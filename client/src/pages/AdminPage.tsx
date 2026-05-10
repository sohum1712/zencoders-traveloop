import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const Sidebar = () => (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-foreground text-white z-40 px-6 py-8">
      <Link to="/" className="font-serif text-2xl mb-10">Traveloop<sup className="text-xs">®</sup></Link>
      <nav className="flex flex-col gap-1 flex-1">
        {[
          { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
          { to: '/trips', label: 'My Trips', icon: '🧳' },
          { to: '/destinations', label: 'Destinations', icon: '🗺️' },
          { to: '/community', label: 'Community', icon: '🌐' },
          { to: '/profile', label: 'Profile', icon: '👤' },
          { to: '/admin', label: 'Admin Panel', icon: '📊' },
        ].map((nav) => (
          <Link key={nav.to} to={nav.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${window.location.pathname === nav.to ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
            <span>{nav.icon}</span>{nav.label}
          </Link>
        ))}
      </nav>
      <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors">🚪 Sign out</button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans">
      <Sidebar />
      <main className="md:ml-64 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="font-serif text-5xl mb-4">Admin Panel</h1>
            <p className="text-muted">Platform-wide analytics and management dashboard.</p>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-rise">
            {[
              { label: 'Total Users', val: '12.4K', change: '+12%', color: 'text-blue-500' },
              { label: 'Active Trips', val: '8.2K', change: '+5%', color: 'text-green-500' },
              { label: 'Revenue', val: '₹142K', change: '+24%', color: 'text-purple-500' },
              { label: 'Destinations', val: '850+', change: '+2%', color: 'text-orange-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-foreground/5 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-2">{s.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="font-serif text-4xl">{s.val}</h3>
                  <span className={`text-xs font-bold ${s.color}`}>{s.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section (Screen 12) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-10 rounded-[2.5rem] border border-foreground/5 shadow-sm animate-fade-rise" style={{ animationDelay: '100ms' }}>
              <h3 className="font-serif text-2xl mb-8">User Growth & Activity</h3>
              <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-foreground/5 pb-2">
                {[40, 70, 45, 90, 65, 80, 50, 100, 85, 75, 95, 110].map((h, i) => (
                  <div key={i} className="w-full bg-foreground/10 rounded-t-lg hover:bg-foreground/20 transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h * 1.2).toFixed(0)}k</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted mt-4">
                <span>Jan</span><span>Jun</span><span>Dec</span>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-foreground/5 shadow-sm animate-fade-rise" style={{ animationDelay: '200ms' }}>
              <h3 className="font-serif text-2xl mb-8">Trip Categories</h3>
              <div className="flex items-center justify-center gap-12 h-64">
                {/* Simulated Pie Chart */}
                <div className="relative w-48 h-48 rounded-full border-[20px] border-foreground/5" style={{ background: 'conic-gradient(#0f0f0f 0deg 120deg, #666 120deg 220deg, #ccc 220deg 360deg)' }}>
                  <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-4">
                    <p className="text-center font-serif text-xl">8.2k<br/><span className="text-[10px] uppercase font-sans text-muted">Trips</span></p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Adventure', color: 'bg-black' },
                    { label: 'Romantic', color: 'bg-[#666]' },
                    { label: 'Cultural', color: 'bg-[#ccc]' },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${c.color}`} />
                      <span className="text-xs font-sans text-muted">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* More Charts / Map Placeholder (Screen 12) */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-foreground/5 shadow-sm animate-fade-rise" style={{ animationDelay: '300ms' }}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-serif text-2xl">Global Reach</h3>
              <div className="flex gap-4">
                {['Popular cities', 'Popular Activities', 'User Trends'].map(b => (
                  <button key={b} className="px-6 py-3 rounded-xl border border-foreground/10 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all">{b}</button>
                ))}
              </div>
            </div>
            <div className="h-96 rounded-[2rem] bg-[#FAFAF9] flex items-center justify-center border border-foreground/5 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=80" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" alt="Map" />
              <div className="relative z-10 text-center">
                <span className="text-6xl mb-4 block">📍</span>
                <p className="font-serif text-3xl">Dynamic World Map View</p>
                <p className="text-muted text-sm mt-2">Visualizing trip hotspots and user distribution globally.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
