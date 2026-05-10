import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { discoverAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface City {
  id: number;
  name: string;
  country: string;
  image_url: string;
  description: string;
}

const DestinationsPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    discoverAPI.getCities().then(res => {
      setCities(res.data);
      setLoading(false);
    });
  }, []);

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
        <div className="max-w-5xl mx-auto">
          {/* Search Header (Screen 8) */}
          <header className="mb-12">
            <h1 className="font-serif text-5xl mb-8">Explore Destinations</h1>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <input type="text" placeholder="Paragliding, City, Activity..." className="w-full pl-12 pr-6 py-4 rounded-2xl border border-foreground/5 bg-white shadow-sm outline-none font-sans" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
              </div>
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                {['Group by', 'Filter', 'Sort by'].map(b => (
                  <button key={b} className="px-6 py-4 rounded-2xl bg-white border border-foreground/5 text-[10px] uppercase tracking-widest font-bold shadow-sm whitespace-nowrap">{b}</button>
                ))}
              </div>
            </div>
          </header>

          <section>
            <h2 className="font-serif text-2xl mb-8">Results</h2>
            <div className="space-y-4">
              {cities.map((city, i) => (
                <div key={city.id} className="bg-white rounded-[2rem] border border-foreground/5 shadow-sm p-4 pr-10 flex items-center gap-8 hover:shadow-md transition-all animate-fade-rise" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={city.image_url} className="w-full h-full object-cover" alt={city.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-serif text-xl">{city.name}</h3>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted">{city.country}</span>
                    </div>
                    <p className="text-sm text-muted line-clamp-1">{city.description || 'Explore breathtaking landscapes and curated local activities.'}</p>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest bg-[#FAFAF9] px-6 py-3 rounded-xl border border-foreground/5 hover:bg-foreground hover:text-background transition-all">Details</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DestinationsPage;
