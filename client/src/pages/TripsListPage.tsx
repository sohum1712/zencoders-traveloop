import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  cover_image_url?: string;
  status: string;
  description?: string;
}

const TripsListPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    tripsAPI.getAll().then(res => {
      setTrips(res.data);
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

  const groupTrips = () => {
    const now = new Date();
    return {
      ongoing: trips.filter(t => new Date(t.start_date) <= now && new Date(t.end_date) >= now),
      upcoming: trips.filter(t => new Date(t.start_date) > now),
      completed: trips.filter(t => new Date(t.end_date) < now),
    };
  };

  const { ongoing, upcoming, completed } = groupTrips();

  const TripCard = ({ trip }: { trip: Trip }) => (
    <Link to={`/trips/${trip.id}`} className="group block bg-white rounded-[2rem] border border-foreground/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-72 h-48 md:h-auto overflow-hidden">
          <img src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={trip.name} />
        </div>
        <div className="p-8 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-serif text-3xl mb-1">{trip.name}</h3>
              <p className="text-xs text-muted uppercase tracking-widest font-bold">
                {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FAFAF9] border border-foreground/5">
              {trip.status}
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-6">
            {trip.description || 'Short Over View of the Trip. Explore breathtaking landscapes, local cuisine, and hidden gems in this curated adventure.'}
          </p>
          <div className="flex gap-4">
            <button className="text-[10px] font-bold uppercase tracking-widest border-b border-foreground">View Details</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground">Edit Itinerary</button>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans">
      <Sidebar />
      <main className="md:ml-64 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="font-serif text-5xl mb-4">My Trips</h1>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <input type="text" placeholder="Search your trips..." className="w-full pl-12 pr-6 py-4 rounded-2xl border border-foreground/5 bg-white shadow-sm outline-none" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
              </div>
              <div className="flex gap-2">
                {['Group by', 'Filter', 'Sort by'].map(b => (
                  <button key={b} className="px-6 py-4 rounded-2xl bg-white border border-foreground/5 text-[10px] uppercase tracking-widest font-bold shadow-sm">{b}</button>
                ))}
              </div>
            </div>
          </header>

          <section className="mb-12">
            <h2 className="font-serif text-2xl mb-8 flex items-center gap-3">
              Ongoing <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </h2>
            {ongoing.length > 0 ? ongoing.map(t => <TripCard key={t.id} trip={t} />) : <p className="text-muted italic ml-4">No ongoing trips.</p>}
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl mb-8">Up-coming</h2>
            {upcoming.length > 0 ? upcoming.map(t => <TripCard key={t.id} trip={t} />) : <p className="text-muted italic ml-4">No upcoming trips.</p>}
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-8">Completed</h2>
            {completed.length > 0 ? completed.map(t => <TripCard key={t.id} trip={t} />) : <p className="text-muted italic ml-4">No completed trips yet.</p>}
          </section>
        </div>
      </main>
    </div>
  );
};

export default TripsListPage;
