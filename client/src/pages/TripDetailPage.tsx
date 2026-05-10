import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const TripDetailPage: React.FC = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI.getById(tripId!).then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, [tripId]);

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

  if (loading) return null;
  const { trip, stops, packing_items, notes } = data;

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans">
      <Sidebar />
      <main className="md:ml-64">
        {/* Banner */}
        <section className="relative h-96 w-full">
          <img src={trip.cover_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80'} className="w-full h-full object-cover" alt="Trip Banner" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12">
            <h1 className="font-serif text-6xl text-white mb-4 animate-fade-rise">{trip.name}</h1>
            <div className="flex gap-6 text-white/80 text-sm font-sans">
              <span>📅 {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</span>
              <span>💰 Budget: ₹{trip.total_budget}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs uppercase tracking-widest">{trip.status}</span>
            </div>
          </div>
          <div className="absolute top-10 right-10 flex gap-4">
            <Link to={`/trips/${trip.id}/billing`} className="bg-white text-black px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-xl hover:scale-105 transition-all">Invoice & Billing</Link>
            <button onClick={() => navigate(`/trips/${trip.id}/itinerary`)} className="bg-white text-black px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-xl hover:scale-105 transition-all">Edit Trip</button>
          </div>
        </section>

        <div className="max-w-6xl mx-auto p-10 -mt-10 relative z-10">
          {/* Tabs */}
          <div className="flex gap-2 mb-12 overflow-x-auto pb-4">
            {['itinerary', 'packing', 'notes', 'community'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} 
                className={`px-10 py-5 rounded-3xl font-serif text-xl transition-all shadow-sm ${activeTab === tab ? 'bg-foreground text-background scale-105' : 'bg-white text-foreground hover:bg-[#FAFAF9]'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ITINERARY VIEW (Screen 9) */}
          {activeTab === 'itinerary' && (
            <div className="space-y-12 animate-fade-rise">
              {stops.map((stop: any, idx: number) => (
                <div key={stop.id} className="bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm p-10">
                  <div className="flex items-center gap-8 mb-10">
                    <span className="font-serif text-6xl text-foreground/10">Day {idx + 1}</span>
                    <h2 className="font-serif text-3xl">Itinerary for {stop.city_name || 'Destination'}</h2>
                  </div>
                  <div className="grid grid-cols-12 gap-8 font-sans text-[10px] uppercase tracking-widest font-bold text-muted border-b border-foreground/5 pb-4 mb-6">
                    <div className="col-span-8">Physical Activity</div>
                    <div className="col-span-4 text-right">Estimated Expense</div>
                  </div>
                  <div className="space-y-4">
                    {/* Simulated activities based on notes */}
                    {['Hotel check-in', 'City Tour', 'Dinner at local spot'].map((act, i) => (
                      <div key={i} className="grid grid-cols-12 gap-8 items-center py-6 border-b border-foreground/5 last:border-0">
                        <div className="col-span-8 bg-[#FAFAF9] px-6 py-4 rounded-2xl flex items-center justify-between">
                          <span className="text-sm font-sans">{act}</span>
                          <span className="text-[10px] text-muted">📍 Location A</span>
                        </div>
                        <div className="col-span-4 bg-[#FAFAF9] px-6 py-4 rounded-2xl text-right font-serif text-lg">
                          ₹{(Math.random() * 100 + 50).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PACKING CHECKLIST (Screen 11) */}
          {activeTab === 'packing' && (
            <div className="bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm p-12 animate-fade-rise">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-serif text-4xl">Packing Checklist</h2>
                <button className="bg-foreground text-background px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold">+ Add Item</button>
              </div>
              {/* Progress Bar (Screen 11) */}
              <div className="mb-12">
                <div className="flex justify-between text-xs font-sans mb-3"><span>Progress: 3/10 packed</span><span>30%</span></div>
                <div className="w-full h-3 bg-[#FAFAF9] rounded-full overflow-hidden"><div className="w-[30%] h-full bg-foreground transition-all duration-1000" /></div>
              </div>
              <div className="space-y-10">
                {['Documents', 'Clothing', 'Electronics'].map(cat => (
                  <div key={cat}>
                    <h3 className="font-serif text-xl mb-6 flex justify-between items-center">{cat} <span className="text-xs text-muted">↓</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {packing_items.filter((i:any) => i.category === cat.toLowerCase()).map((item: any) => (
                        <label key={item.id} className="flex items-center gap-4 p-5 rounded-2xl border border-foreground/5 bg-[#FAFAF9] cursor-pointer hover:bg-white transition-all">
                          <input type="checkbox" checked={item.is_packed} className="w-5 h-5 rounded-full accent-foreground" />
                          <span className="text-sm font-sans">{item.item_name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRIP NOTES / JOURNAL (Screen 13) */}
          {activeTab === 'notes' && (
            <div className="bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm p-12 animate-fade-rise">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-serif text-4xl">Trip Notes</h2>
                <button className="bg-foreground text-background px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold">+ Add Note</button>
              </div>
              <div className="flex gap-4 mb-10">
                {['All', 'By Day', 'By Stop'].map(f => (
                  <button key={f} className={`px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all ${f === 'All' ? 'bg-foreground text-background border-foreground' : 'border-foreground/10 text-muted hover:border-foreground'}`}>{f}</button>
                ))}
              </div>
              <div className="space-y-6">
                {notes.map((note: any) => (
                  <div key={note.id} className="p-8 rounded-[2rem] border border-foreground/5 bg-[#FAFAF9] relative group">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-serif text-xl">{note.title || 'Note Title'}</h4>
                      <span className="text-[10px] text-muted">{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{note.content}</p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="text-xs">✏️</button>
                      <button className="text-xs">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMMUNITY PREVIEW (Screen 10 placeholder) */}
          {activeTab === 'community' && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm animate-fade-rise">
              <span className="text-6xl mb-6 block">🌐</span>
              <h2 className="font-serif text-4xl mb-4">Traveloop Community</h2>
              <p className="text-muted max-w-md mx-auto mb-10">Connect with fellow travelers, share your itinerary, and discover hidden gems from around the world.</p>
              <button onClick={() => navigate('/community')} className="bg-foreground text-background px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest">Go to Community Tab</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TripDetailPage;
