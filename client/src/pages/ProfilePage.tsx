import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripsAPI, userAPI } from '../lib/api';

const ProfilePage: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI.getAll().then(res => {
      setTrips(res.data);
      setLoading(false);
    });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await userAPI.updateProfile(editForm);
      setUser(res.data.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Could not update profile.');
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
          <Link key={nav.to} to={nav.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${window.location.pathname === nav.to ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
            <span>{nav.icon}</span>{nav.label}
          </Link>
        ))}
      </nav>
      <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors">🚪 Sign out</button>
    </aside>
  );

  const TripGrid = ({ title, items }: { title: string, items: any[] }) => (
    <section className="mb-16">
      <h2 className="font-serif text-3xl mb-8">{title}</h2>
      {items.length === 0 ? (
        <p className="text-muted italic">No trips to show here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((trip, i) => (
            <div key={trip.id} className="group bg-white rounded-[2rem] overflow-hidden border border-foreground/5 shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-rise" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-48 overflow-hidden">
                <img src={trip.cover_image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={trip.name} />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl mb-4">{trip.name}</h3>
                <Link to={`/trips/${trip.id}`} className="inline-block px-8 py-3 rounded-xl border border-foreground/10 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans">
      <Sidebar />
      <main className="md:ml-64 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          {/* User Details (Screen 7) */}
          <section className="bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm p-10 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-12 animate-fade-rise">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#FAFAF9] shadow-lg flex-shrink-0">
              <img src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0f0f0f&color=fff&size=200`} className="w-full h-full object-cover" alt="User" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="font-serif text-4xl md:text-5xl">{user?.firstName} {user?.lastName}</h1>
                <button onClick={() => setIsEditing(true)} className="px-8 py-3 rounded-full bg-foreground text-background text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all">Edit Profile</button>
              </div>
              <p className="text-muted leading-relaxed max-w-xl">
                Passionate traveler based in the world. Mapping out the extraordinary, one city at a time. 
                Always looking for the next hidden gem and local experience.
              </p>
              <div className="flex gap-8 mt-8 justify-center md:justify-start">
                <div><p className="text-2xl font-serif">{trips.length}</p><p className="text-[10px] uppercase tracking-widest text-muted font-bold">Planned Trips</p></div>
                <div><p className="text-2xl font-serif">12</p><p className="text-[10px] uppercase tracking-widest text-muted font-bold">Countries</p></div>
                <div><p className="text-2xl font-serif">45</p><p className="text-[10px] uppercase tracking-widest text-muted font-bold">Cities</p></div>
              </div>
            </div>
          </section>

          <TripGrid title="Preplanned Trips" items={trips.filter(t => t.status === 'planning')} />
          <TripGrid title="Previous Trips" items={trips.filter(t => t.status === 'completed')} />
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 animate-fade-rise">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-serif text-3xl">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-2xl">✕</button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">First Name</label>
                  <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-foreground/5 bg-[#FAFAF9] focus:ring-4 focus:ring-foreground/5 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Last Name</label>
                  <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-foreground/5 bg-[#FAFAF9] focus:ring-4 focus:ring-foreground/5 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-muted mb-2">Phone Number</label>
                <input type="text" value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-foreground/5 bg-[#FAFAF9] focus:ring-4 focus:ring-foreground/5 outline-none" />
              </div>
              <button type="submit" className="w-full py-5 rounded-2xl bg-foreground text-background font-bold text-sm uppercase tracking-widest shadow-xl hover:opacity-90 transition-all mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
