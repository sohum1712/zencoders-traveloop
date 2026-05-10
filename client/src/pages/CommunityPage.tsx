import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulated community posts with diverse data
    const mockPosts = [
      {
        id: 1,
        user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', handle: '@sarah_travels' },
        content: 'Just finished my 2-week trip to Kyoto! The bamboo forest is absolutely magical at 6 AM. Highly recommend visiting early to avoid the crowds. 🎋⛩️',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        likes: 124,
        comments: 18,
        time: '2h'
      },
      {
        id: 2,
        user: { name: 'Marcus Miller', avatar: 'https://i.pravatar.cc/150?u=marcus', handle: '@marcus_m' },
        content: 'Found this hidden gelato spot in Rome behind the Pantheon. Best pistachio I’ve ever had! 🍦🇮🇹',
        likes: 89,
        comments: 5,
        time: '5h'
      },
      {
        id: 3,
        user: { name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?u=elena', handle: '@elena_explores' },
        content: 'Iceland is out of this world. The Northern Lights finally showed up last night! 🌌🇮🇸',
        image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80',
        likes: 456,
        comments: 42,
        time: '8h'
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      user: { 
        name: `${user?.firstName} ${user?.lastName}`, 
        avatar: `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0f0f0f&color=fff`,
        handle: `@${user?.firstName?.toLowerCase()}_${user?.lastName?.toLowerCase()}`
      },
      content: newPost,
      likes: 0,
      comments: 0,
      time: 'Just now'
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const Sidebar = () => (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-foreground/5 z-40 px-6 py-8">
      <Link to="/" className="font-serif text-2xl mb-10 text-foreground">Traveloop<sup className="text-xs">®</sup></Link>
      <nav className="flex flex-col gap-1 flex-1">
        {[
          { to: '/dashboard', label: 'Home', icon: '🏠' },
          { to: '/community', label: 'Explore', icon: '🌐' },
          { to: '/trips', label: 'My Trips', icon: '🧳' },
          { to: '/destinations', label: 'Destinations', icon: '🗺️' },
          { to: '/profile', label: 'Profile', icon: '👤' },
        ].map((nav) => (
          <Link key={nav.to} to={nav.to} className={`flex items-center gap-4 px-4 py-3 rounded-full text-lg transition-colors ${window.location.pathname === nav.to ? 'font-bold text-foreground' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}>
            <span className="text-xl">{nav.icon}</span>{nav.label}
          </Link>
        ))}
      </nav>
      <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-4 px-4 py-3 rounded-full text-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors mt-auto">🚪 Sign out</button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      <Sidebar />
      <main className="md:ml-64 lg:ml-64 flex justify-center">
        <div className="w-full max-w-2xl border-x border-foreground/5 min-h-screen">
          {/* Sticky Header */}
          <header className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-6 py-4 border-b border-foreground/5">
            <h1 className="font-serif text-2xl font-bold">Community</h1>
          </header>

          {/* New Post Input (Twitter Style) */}
          <div className="px-6 py-6 border-b border-foreground/5 flex gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-foreground/5">
              <img src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0f0f0f&color=fff`} alt="User" />
            </div>
            <div className="flex-1">
              <textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening in your travels?" 
                className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none placeholder:text-foreground/30"
                rows={2}
              />
              <div className="flex justify-between items-center mt-4 border-t border-foreground/5 pt-4">
                <div className="flex gap-4 text-foreground/40">
                  <button className="hover:text-foreground">🖼️</button>
                  <button className="hover:text-foreground">📍</button>
                  <button className="hover:text-foreground">😊</button>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="bg-foreground text-white px-8 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="divide-y divide-foreground/5">
            {posts.map((post) => (
              <div key={post.id} className="px-6 py-6 hover:bg-foreground/5 transition-colors cursor-pointer animate-fade-rise">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img src={post.user.avatar} className="w-full h-full object-cover" alt={post.user.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold hover:underline">{post.user.name}</span>
                      <span className="text-foreground/40 text-sm">{post.user.handle}</span>
                      <span className="text-foreground/40 text-sm">· {post.time}</span>
                    </div>
                    <p className="text-[17px] leading-relaxed mb-4">{post.content}</p>
                    {post.image && (
                      <div className="rounded-2xl overflow-hidden border border-foreground/5 mb-4 max-h-[400px]">
                        <img src={post.image} className="w-full h-full object-cover" alt="Post content" />
                      </div>
                    )}
                    <div className="flex justify-between max-w-md text-foreground/40">
                      <button className="flex items-center gap-2 hover:text-blue-500 group transition-colors">
                        <span className="p-2 group-hover:bg-blue-50 rounded-full transition-colors">💬</span> {post.comments}
                      </button>
                      <button className="flex items-center gap-2 hover:text-green-500 group transition-colors">
                        <span className="p-2 group-hover:bg-green-50 rounded-full transition-colors">🔁</span> {Math.floor(post.likes/2)}
                      </button>
                      <button className="flex items-center gap-2 hover:text-red-500 group transition-colors">
                        <span className="p-2 group-hover:bg-red-50 rounded-full transition-colors">❤️</span> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 hover:text-blue-500 group transition-colors">
                        <span className="p-2 group-hover:bg-blue-50 rounded-full transition-colors">📊</span> {post.likes * 10}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar (Trends) */}
        <aside className="hidden lg:block w-80 p-6 space-y-6">
          <div className="bg-foreground/5 rounded-2xl p-6">
            <h2 className="font-bold text-xl mb-6">Trends for you</h2>
            {[
              { tag: '#Traveloop2026', count: '12.4K posts' },
              { tag: '#KyotoVibes', count: '8.1K posts' },
              { tag: '#SoloTravel', count: '5.2K posts' },
              { tag: '#HiddenGems', count: '3.9K posts' },
            ].map(t => (
              <div key={t.tag} className="mb-4 last:mb-0 hover:bg-foreground/5 cursor-pointer rounded-xl transition-all">
                <p className="text-xs text-foreground/40">Trending</p>
                <p className="font-bold">{t.tag}</p>
                <p className="text-xs text-foreground/40">{t.count}</p>
              </div>
            ))}
          </div>
          <div className="bg-foreground/5 rounded-2xl p-6">
            <h2 className="font-bold text-xl mb-6">Who to follow</h2>
            {[
              { name: 'National Geo', handle: '@natgeo' },
              { name: 'Lonely Planet', handle: '@lonelyplanet' },
            ].map(f => (
              <div key={f.handle} className="flex items-center justify-between mb-4 last:mb-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-foreground/20" />
                  <div>
                    <p className="font-bold text-sm">{f.name}</p>
                    <p className="text-xs text-foreground/40">{f.handle}</p>
                  </div>
                </div>
                <button className="bg-foreground text-white px-4 py-1.5 rounded-full text-xs font-bold">Follow</button>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CommunityPage;
