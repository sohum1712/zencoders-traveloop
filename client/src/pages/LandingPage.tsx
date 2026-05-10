import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const STATS = [
  { value: '10K+', label: 'Trips Planned' },
  { value: '150+', label: 'Destinations' },
  { value: '98%', label: 'Happy Travelers' },
  { value: '4.9★', label: 'App Rating' },
];

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Smart Itinerary Builder',
    desc: 'Drag-and-drop city planning with automatic duration calculations and route optimization.',
  },
  {
    icon: '💰',
    title: 'Budget Tracker',
    desc: 'Track every expense by category. Real-time breakdowns keep you on budget always.',
  },
  {
    icon: '🎒',
    title: 'Packing Lists',
    desc: 'Smart packing checklist tailored to your destination, weather, and trip duration.',
  },
  {
    icon: '📓',
    title: 'Travel Journal',
    desc: 'Capture memories, notes, and stories from every destination you visit.',
  },
  {
    icon: '🔒',
    title: 'Private & Secure',
    desc: 'Your travel data is encrypted and private. Share only what you want.',
  },
  {
    icon: '🌐',
    title: 'Share Itineraries',
    desc: 'Make trips public and let fellow travelers discover your curated routes.',
  },
];

const DESTINATIONS = [
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tag: 'Tropical' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', tag: 'Romantic' },
  { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', tag: 'Cultural' },
  { name: 'Patagonia', country: 'Argentina', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', tag: 'Adventure' },
  { name: 'Amalfi', country: 'Italy', img: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600&q=80', tag: 'Scenic' },
  { name: 'Marrakech', country: 'Morocco', img: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=600&q=80', tag: 'Exotic' },
];

const LandingPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video fade loop logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let raf: number;

    const tick = () => {
      if (!video.paused && video.duration) {
        const remaining = video.duration - video.currentTime;
        if (remaining < 0.5) {
          video.style.opacity = String(Math.max(0, remaining / 0.5));
        } else if (video.currentTime < 0.5) {
          video.style.opacity = String(Math.min(1, video.currentTime / 0.5));
        } else {
          video.style.opacity = '1';
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, 100);
    };

    video.addEventListener('ended', onEnded);
    raf = requestAnimationFrame(tick);
    video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground font-sans">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen w-full overflow-hidden bg-white">
        {/* Background Video - No fallback images here to prevent the split-second flash */}
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80"
          className="absolute inset-0 w-full h-full object-cover z-1 transition-opacity duration-700"
          style={{ opacity: 0 }} // Starts at 0, useEffect will fade it in
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" style={{ zIndex: 2 }} />
        <div className="absolute inset-0 bg-black/20" style={{ zIndex: 2 }} />

        {/* Nav */}
        <div style={{ zIndex: 60, position: 'relative' }}>
          <Navbar />
        </div>

        {/* Hero content */}
        <div
          className="relative flex flex-col items-center justify-center text-center px-6"
          style={{ paddingTop: '12rem', paddingBottom: '12rem', zIndex: 10 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-sans border border-white/40 text-white/90 bg-white/10 backdrop-blur-sm mb-8 animate-fade-rise">
            ✈️ Your Journey Begins Here
          </span>

          <h1
            className="font-serif font-normal max-w-5xl animate-fade-rise"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 0.95,
              letterSpacing: '-2.46px',
              color: '#FFFFFF',
            }}
          >
            Beyond borders,{' '}
            <span style={{ color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>
              we map{' '}
            </span>
            the extraordinary.
          </h1>

          <p className="font-sans text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-white/80 animate-fade-rise-delay">
            Plan dream trips with intelligent itineraries, budget tracking, and seamless collaboration.
            Traveloop transforms the way you explore the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 animate-fade-rise-delay-2">
            <Link
              to="/login"
              className="rounded-full px-14 py-5 text-base font-sans bg-white text-foreground hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              Start Planning Free
            </Link>
            <Link
              to="/destinations"
              className="rounded-full px-10 py-5 text-base font-sans border border-white/60 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Explore Destinations
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-rise-delay-2">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-serif text-white font-bold">{s.value}</div>
                <div className="text-xs font-sans text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-normal" style={{ letterSpacing: '-1px' }}>
            Everything you need to{' '}
            <span className="text-muted italic">travel smarter</span>
          </h2>
          <p className="font-sans text-muted mt-4 max-w-xl mx-auto text-base leading-relaxed">
            Built for adventurers, designed for clarity. Every tool you need, nothing you don't.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-2xl border border-foreground/10 bg-white hover:shadow-xl transition-shadow group"
            >
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="font-serif text-xl mb-3 font-normal group-hover:text-foreground/80 transition-colors">
                {f.title}
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section className="py-24 px-6 bg-foreground text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal" style={{ letterSpacing: '-1px' }}>
              Popular{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>Destinations</span>
            </h2>
            <p className="font-sans text-white/60 mt-4 max-w-xl mx-auto text-base">
              From tropical shores to ancient cities — discover what the world has to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((d) => (
              <div key={d.name} className="group relative rounded-2xl overflow-hidden cursor-pointer">
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="text-xs font-sans text-white/70 uppercase tracking-widest">{d.tag}</span>
                  <h3 className="font-serif text-2xl text-white mt-1">{d.name}</h3>
                  <p className="font-sans text-sm text-white/70">{d.country}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-sans bg-white text-foreground px-3 py-1.5 rounded-full">Explore →</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/login"
              className="inline-block rounded-full px-10 py-4 text-base font-sans border border-white/40 text-white hover:bg-white hover:text-foreground transition-colors"
            >
              Plan Your Trip Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-normal" style={{ letterSpacing: '-1px' }}>
            How <span className="text-muted italic">Traveloop</span> works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { step: '01', title: 'Create Your Trip', desc: 'Set dates, destinations, and your total budget in seconds.' },
            { step: '02', title: 'Build Your Itinerary', desc: 'Add cities, activities, and plan each day with our visual builder.' },
            { step: '03', title: 'Travel & Track', desc: 'Log expenses, write notes, and check off your packing list on the go.' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center">
              <span className="font-serif text-6xl text-foreground/10 font-normal">{item.step}</span>
              <h3 className="font-serif text-2xl mt-4 font-normal">{item.title}</h3>
              <p className="font-sans text-muted text-sm mt-3 leading-relaxed max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section
        className="relative py-32 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl sm:text-6xl font-normal leading-tight" style={{ letterSpacing: '-1px' }}>
            Ready to start your{' '}
            <span style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>next adventure?</span>
          </h2>
          <p className="font-sans text-white/60 mt-6 text-lg leading-relaxed">
            Join thousands of travelers who plan smarter with Traveloop. Free to start, forever flexible.
          </p>
          <Link
            to="/login"
            className="inline-block mt-10 rounded-full px-14 py-5 text-base font-sans bg-white text-foreground hover:scale-105 transition-transform"
          >
            Begin Your Journey
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-2xl text-foreground">
            Traveloop<sup className="text-xs">®</sup>
          </div>
          <div className="flex gap-8 font-sans text-sm text-muted">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/trips" className="hover:text-foreground transition-colors">My Trips</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
          <p className="font-sans text-xs text-muted">© 2025 Traveloop. Made with ❤️ for explorers.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
