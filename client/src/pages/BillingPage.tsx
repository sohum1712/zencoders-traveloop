import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const BillingPage: React.FC = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<any>(null);
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
  const { trip, expenses } = data;
  const totalSpent = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
  const remaining = trip.total_budget - totalSpent;

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans">
      <Sidebar />
      <main className="md:ml-64 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header & Navigation */}
          <div className="flex items-center justify-between mb-12">
            <Link to={`/trips/${tripId}`} className="text-sm font-sans text-muted hover:text-foreground">← back to Trip Details</Link>
            <div className="flex gap-4">
              <input type="text" placeholder="Search invoices..." className="px-6 py-3 rounded-xl border border-foreground/5 bg-white text-xs outline-none" />
              <button className="px-6 py-3 rounded-xl bg-white border border-foreground/5 text-[10px] uppercase font-bold tracking-widest">Filter</button>
              <button className="px-6 py-3 rounded-xl bg-white border border-foreground/5 text-[10px] uppercase font-bold tracking-widest">Sort #</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Invoice Card (Screen 14) */}
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm p-10 animate-fade-rise">
              <div className="flex flex-col md:flex-row gap-8 mb-12 border-b border-foreground/5 pb-10">
                <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-md flex-shrink-0">
                  <img src={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80'} className="w-full h-full object-cover" alt="Trip" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <h2 className="font-serif text-2xl mb-2">{trip.name}</h2>
                    <p className="text-muted text-xs uppercase tracking-widest font-bold">
                      {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div><p className="text-[10px] uppercase tracking-widest font-bold text-muted">Invoice Id</p><p className="font-mono">INV-{tripId?.slice(0, 8).toUpperCase()}</p></div>
                    <div><p className="text-[10px] uppercase tracking-widest font-bold text-muted">Generated date</p><p>{new Date().toLocaleDateString()}</p></div>
                  </div>
                  <div className="space-y-4">
                    <div><p className="text-[10px] uppercase tracking-widest font-bold text-muted">Traveler Details</p><p>James Rivera<br/>Alex Smith</p></div>
                  </div>
                  <div className="space-y-4">
                    <div><p className="text-[10px] uppercase tracking-widest font-bold text-muted">Payment status</p><span className="text-xs text-orange-500 font-bold uppercase tracking-widest">Pending</span></div>
                  </div>
                </div>
              </div>

              {/* Expense Table (Screen 14) */}
              <div className="overflow-x-auto mb-10">
                <table className="w-full text-left font-sans text-sm">
                  <thead className="text-[10px] uppercase tracking-widest font-bold text-muted border-b border-foreground/5">
                    <tr>
                      <th className="pb-4 pr-4">#</th>
                      <th className="pb-4 pr-4">Category</th>
                      <th className="pb-4 pr-4">Description</th>
                      <th className="pb-4 pr-4">Qty/details</th>
                      <th className="pb-4 pr-4">Unit Cost</th>
                      <th className="pb-4 pr-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {expenses.length > 0 ? expenses.map((exp: any, i: number) => (
                      <tr key={exp.id}>
                        <td className="py-6 pr-4">{i + 1}</td>
                        <td className="py-6 pr-4"><span className="bg-[#FAFAF9] px-3 py-1 rounded-full text-[10px] uppercase font-bold">{exp.category}</span></td>
                        <td className="py-6 pr-4">{exp.description}</td>
                        <td className="py-6 pr-4">{exp.quantity || '1 night'}</td>
                        <td className="py-6 pr-4">₹{exp.unit_cost || exp.amount}</td>
                        <td className="py-6 pr-4 text-right font-serif text-lg">₹{exp.amount}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} className="py-12 text-center text-muted italic">No expenses logged for this trip yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-8 border-t border-foreground/5">
                <div className="w-72 space-y-3">
                  <div className="flex justify-between text-sm text-muted"><span>Subtotal</span><span>₹{totalSpent.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-muted"><span>Tax (5%)</span><span>₹{(totalSpent * 0.05).toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-muted"><span>Discount</span><span>-₹0.00</span></div>
                  <div className="flex justify-between font-serif text-3xl pt-3 border-t border-foreground/5"><span>Grand Total</span><span>₹{(totalSpent * 1.05).toFixed(2)}</span></div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button className="px-8 py-4 rounded-xl border border-foreground/10 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all">Download Invoice</button>
                <button className="px-8 py-4 rounded-xl border border-foreground/10 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all">Export as PDF</button>
                <button className="ml-auto px-10 py-4 rounded-xl bg-foreground text-background text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all">Mark as paid</button>
              </div>
            </div>

            {/* Budget Insights Sidebar (Screen 14) */}
            <div className="lg:col-span-4 space-y-8 animate-fade-rise" style={{ animationDelay: '200ms' }}>
              <div className="bg-white rounded-[2.5rem] border border-foreground/5 shadow-sm p-10">
                <h3 className="font-serif text-2xl mb-8">Budget Insights</h3>
                <div className="flex items-center justify-center mb-10">
                  {/* Dynamic Pie Chart */}
                  <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner" style={{ 
                    background: `conic-gradient(#0f0f0f ${Math.min(100, (totalSpent/trip.total_budget)*360)}deg, #FAFAF9 0deg)`
                  }}>
                    <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-6 shadow-sm">
                      <p className="text-center font-serif text-xl">{Math.round((totalSpent/trip.total_budget)*100)}%<br/><span className="text-[10px] uppercase font-sans text-muted">Spent</span></p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between"><span className="text-xs text-muted">Total Budget:</span><span className="font-bold">₹{trip.total_budget}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-muted">Total Spent:</span><span className="font-bold">₹{totalSpent.toFixed(2)}</span></div>
                  <div className={`flex justify-between pt-4 border-t border-foreground/5 ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    <span className="text-xs font-bold uppercase tracking-widest">Remaining:</span>
                    <span className="font-serif text-2xl">₹{remaining.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full mt-10 py-4 rounded-2xl bg-[#FAFAF9] border border-foreground/5 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all">View Full Budget</button>
              </div>

              {/* Extra Stats / Tips */}
              <div className="bg-foreground text-white rounded-[2.5rem] p-10">
                <h4 className="font-serif text-xl mb-4">Spending Tip</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  You've spent 85% of your travel budget on accommodation. Consider exploring local markets for more affordable dining options!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingPage;
