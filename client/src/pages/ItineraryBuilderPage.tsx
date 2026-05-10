import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tripsAPI, discoverAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Stop {
  id?: number;
  city_id: number;
  arrival_date: string;
  departure_date: string;
  notes: string;
  budget?: string;
  city_name?: string;
}

const ItineraryBuilderPage: React.FC = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, citiesRes] = await Promise.all([
          tripsAPI.getById(tripId!),
          discoverAPI.getCities()
        ]);
        setTrip(tripRes.data.trip);
        setStops(tripRes.data.stops.map((s: any) => ({
          ...s,
          arrival_date: s.arrival_date.split('T')[0],
          departure_date: s.departure_date.split('T')[0],
          budget: '0'
        })));
        setCities(citiesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  const addSection = () => {
    setStops([...stops, { city_id: cities[0]?.id || 1, arrival_date: '', departure_date: '', notes: '', budget: '0' }]);
  };

  const updateStop = (index: number, field: keyof Stop, value: any) => {
    const newStops = [...stops];
    (newStops[index] as any)[field] = value;
    setStops(newStops);
  };

  const saveItinerary = async () => {
    try {
      setLoading(true);
      await tripsAPI.updateItinerary(tripId!, stops.map(s => ({
        city_id: s.city_id,
        arrival_date: s.arrival_date || trip.start_date,
        departure_date: s.departure_date || trip.end_date,
        notes: s.notes
      })));
      navigate(`/trips/${tripId}`);
    } catch (err) {
      console.error(err);
      alert('Could not save itinerary. Please try again.');
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

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans">
      <Sidebar />
      <main className="md:ml-64 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-12">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl">Build Itinerary</h1>
              <p className="text-muted mt-2">Construct your journey section by section.</p>
            </div>
            <button onClick={saveItinerary} className="bg-foreground text-background px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Save Changes</button>
          </header>

          <div className="space-y-8">
            {stops.map((stop, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm p-10 animate-fade-rise" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex justify-between items-start mb-8">
                  <h2 className="font-serif text-2xl">Section {i + 1}</h2>
                  <select 
                    value={stop.city_id}
                    onChange={e => updateStop(i, 'city_id', Number(e.target.value))}
                    className="bg-[#FAFAF9] border-none text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-xl focus:ring-2 focus:ring-foreground/5 outline-none"
                  >
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Necessary Information</label>
                    <textarea 
                      value={stop.notes}
                      onChange={e => updateStop(i, 'notes', e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-foreground/10 focus:ring-4 focus:ring-foreground/5 outline-none transition-all resize-none" 
                      placeholder="e.g. Travel section, hotel or any other activity..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 bg-[#FAFAF9] px-6 py-4 rounded-2xl border border-foreground/5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted whitespace-nowrap">Date Range:</span>
                      <input 
                        type="date" 
                        value={stop.arrival_date} 
                        onChange={e => updateStop(i, 'arrival_date', e.target.value)}
                        className="bg-transparent border-none text-xs focus:ring-0 w-full" 
                      />
                      <span className="text-muted">to</span>
                      <input 
                        type="date" 
                        value={stop.departure_date} 
                        onChange={e => updateStop(i, 'departure_date', e.target.value)}
                        className="bg-transparent border-none text-xs focus:ring-0 w-full" 
                      />
                    </div>
                    <div className="flex items-center gap-4 bg-[#FAFAF9] px-6 py-4 rounded-2xl border border-foreground/5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted whitespace-nowrap">Budget of this section (₹):</span>
                      <input 
                        type="number" 
                        value={stop.budget} 
                        onChange={e => updateStop(i, 'budget', e.target.value)}
                        className="bg-transparent border-none text-xs font-bold focus:ring-0 w-full" 
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={addSection}
              className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-foreground/10 text-muted hover:border-foreground/30 hover:text-foreground transition-all flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm"
            >
              <span className="text-xl">➕</span> Add another Section
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItineraryBuilderPage;
