import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tripsAPI, discoverAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  cover_image_url?: string;
  status: string;
}

interface City {
  id: number;
  name: string;
  country: string;
  image_url: string;
  description: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('popular');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch User Location (Safe Fallback)
        fetch('https://geolocation-db.com/json/')
          .then(res => res.json())
          .then(data => {
            if (data.city) {
              setUserLocation(`${data.city}, ${data.country_name}`);
            } else {
              setUserLocation('Global Traveler');
            }
          })
          .catch(() => setUserLocation('Global Traveler'));

        // 2. Fetch Data
        const [tripsRes, citiesRes] = await Promise.all([
          tripsAPI.getAll(),
          discoverAPI.getCities()
        ]);
        
        setTrips(tripsRes.data);
        setPopularCities(citiesRes.data);
        setFilteredCities(citiesRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Search & Filtering
  useEffect(() => {
    let result = [...popularCities];
    
    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeSort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'country') {
      result.sort((a, b) => a.country.localeCompare(b.country));
    }

    setFilteredCities(result.slice(0, 6));
  }, [searchQuery, popularCities, activeSort]);

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
          <Link key={nav.to} to={nav.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
              window.location.pathname === nav.to ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}>
            <span>{nav.icon}</span>{nav.label}
          </Link>
        ))}
      </nav>
      <button onClick={() => { logout(); navigate('/'); }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors">
        🚪 Sign out
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans">
      <Sidebar />
      <main className="md:ml-64 p-6 md:p-10 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Personalization Banner */}
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-xl">📍</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Currently in</p>
                <p className="text-sm font-bold">{userLocation || 'Detecting location...'}</p>
              </div>
            </div>
          </header>

          {/* Banner Image (Screen 3) */}
          <section className="relative h-[300px] rounded-[2.5rem] overflow-hidden mb-12 animate-fade-rise">
            <img 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80" 
              className="w-full h-full object-cover" 
              alt="Adventure awaits" 
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-12 text-white">
              <h1 className="font-serif text-5xl md:text-6xl mb-4">Welcome back, {user?.firstName}</h1>
              <p className="font-sans text-lg opacity-90 max-w-xl">Ready to map out your next extraordinary journey?</p>
            </div>
          </section>

          {/* Search Bar + Filters (Screen 3) */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 items-center">
            <div className="relative flex-1 w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, countries..." 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-foreground/5 bg-white shadow-sm focus:ring-4 focus:ring-foreground/5 transition-all outline-none"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {[
                { id: 'popular', label: 'Popular' },
                { id: 'name', label: 'Sort A-Z' },
                { id: 'country', label: 'By Country' }
              ].map(btn => (
                <button 
                  key={btn.id} 
                  onClick={() => setActiveSort(btn.id)}
                  className={`px-6 py-4 rounded-2xl border border-foreground/5 text-[10px] uppercase tracking-widest font-bold shadow-sm transition-all whitespace-nowrap ${
                    activeSort === btn.id ? 'bg-foreground text-background' : 'bg-white text-muted hover:bg-[#FAFAF9]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top Regional Selections (Screen 3) */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl mb-8">Top Regional Selections</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredCities.map((city, i) => (
                <Link to={`/destinations`} key={city.id} className="group relative h-48 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-rise" style={{ animationDelay: `${i * 100}ms` }}>
                  <img src={city.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={city.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-serif text-lg">{city.name}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-70">{city.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Previous Trips (Screen 3) */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl">Previous Trips</h2>
              <Link to="/trips" className="text-sm font-sans text-muted hover:text-foreground underline">View all</Link>
            </div>
            {trips.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-foreground/10">
                <p className="text-muted">No trips planned yet. Time to start an adventure!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trips.filter(t => t.status === 'completed' || t.status === 'planning').slice(0, 4).map((trip, i) => (
                  <Link to={`/trips/${trip.id}`} key={trip.id} className="group bg-white rounded-3xl overflow-hidden border border-foreground/5 shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-rise" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="h-40 overflow-hidden">
                      <img src={trip.cover_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={trip.name} />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl mb-1">{trip.name}</h3>
                      <p className="text-xs text-muted">
                        {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Floating Action Button (Screen 3) */}
        <Link 
          to="/trips/new" 
          className="fixed bottom-10 right-10 flex items-center gap-3 bg-foreground text-background px-8 py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 group"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform duration-500">➕</span>
          <span className="font-sans font-bold text-sm uppercase tracking-widest">Plan a trip</span>
        </Link>
      </main>
    </div>
  );
};

export default DashboardPage;
