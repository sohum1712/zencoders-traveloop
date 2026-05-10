import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tripsAPI, discoverAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    isPublic: false,
    coverImageUrl: '',
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    discoverAPI.getCities().then(res => setSuggestions(res.data.slice(0, 6)));
  }, []);

  useEffect(() => {
    if (citySearch.length > 2) {
      const delay = setTimeout(() => {
        discoverAPI.searchCities({ query: citySearch }).then(res => setCityResults(res.data));
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setCityResults([]);
    }
  }, [citySearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.startDate || !form.endDate) return setError('Name, start date, and end date are required.');
    setLoading(true);
    try {
      const res = await tripsAPI.create({
        ...form,
        totalBudget: form.totalBudget ? Number(form.totalBudget) : 0,
        coverImageUrl: selectedCity?.image_url || form.coverImageUrl,
      });
      navigate(`/trips/${res.data.id}/itinerary`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not create trip.');
    } finally {
      setLoading(false);
    }
  };

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
          <Link key={nav.to} to={nav.to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors">
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
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl">Plan a new trip</h1>
          </header>

          <div className="bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm p-10 mb-16">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-3">Trip Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-foreground/10 focus:ring-4 focus:ring-foreground/5 transition-all outline-none" placeholder="e.g. Summer in Tuscany" />
                </div>
                <div className="relative">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-3">Select a Place</label>
                  <input 
                    type="text" 
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Search cities..." 
                    className="w-full px-6 py-4 rounded-2xl border border-foreground/10 focus:ring-4 focus:ring-foreground/5 transition-all outline-none" 
                  />
                  {cityResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-foreground/5 rounded-2xl shadow-xl z-50 overflow-hidden">
                      {cityResults.map(city => (
                        <button key={city.id} type="button" onClick={() => { setSelectedCity(city); setCitySearch(city.name); setCityResults([]); }} className="w-full px-6 py-4 text-left hover:bg-foreground/5 flex items-center gap-4 transition-colors">
                          <img src={city.image_url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <div><p className="font-bold text-sm">{city.name}</p><p className="text-[10px] text-muted">{city.country}</p></div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-3">Estimated Budget (₹)</label>
                  <input type="number" value={form.totalBudget} onChange={e => setForm({...form, totalBudget: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-foreground/10 focus:ring-4 focus:ring-foreground/5 transition-all outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-3">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-foreground/10 focus:ring-4 focus:ring-foreground/5 transition-all outline-none bg-[#FAFAF9]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-3">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-foreground/10 focus:ring-4 focus:ring-foreground/5 transition-all outline-none bg-[#FAFAF9]" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl bg-foreground text-background font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-foreground/90 transition-all disabled:opacity-50">
                {loading ? 'Initializing...' : 'Next: Build Itinerary →'}
              </button>
            </form>
          </div>

          <section className="animate-fade-rise">
            <h2 className="font-serif text-3xl mb-8">Suggestion for Places to Visit / Activities to preform</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((city, i) => (
                <div key={city.id} className="group h-64 rounded-[2rem] overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-rise" style={{ animationDelay: `${i * 100}ms` }}>
                  <img src={city.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={city.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-serif text-2xl">{city.name}</p>
                    <p className="text-xs opacity-70 mb-4">{city.country}</p>
                    <button onClick={() => { setSelectedCity(city); setCitySearch(city.name); }} className="px-4 py-2 rounded-full border border-white/40 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Add to Trip</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CreateTripPage;
