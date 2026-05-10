import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';

interface PublicData {
  trip: {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    first_name: string;
    last_name: string;
  };
  stops: any[];
  activities: any[];
}

const PublicItineraryPage: React.FC = () => {
  const { shareUrl } = useParams<{ shareUrl: string }>();
  const [data, setData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/public/itinerary/${shareUrl}`)
      .then(res => setData(res.data))
      .catch(() => setError('Itinerary not found or is no longer public.'))
      .finally(() => setLoading(false));
  }, [shareUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAF9]">
        <div className="w-10 h-10 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAF9] p-10 text-center">
        <p className="text-6xl mb-6">🏝️</p>
        <h1 className="font-serif text-3xl mb-4">{error || 'Unable to load itinerary'}</h1>
        <Link to="/" className="text-foreground underline font-sans text-sm font-medium">Go to Traveloop Home</Link>
      </div>
    );
  }

  const { trip, stops, activities } = data;

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans pb-20">
      {/* Cinematic Header */}
      <div className="relative h-[400px] md:h-[550px]">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt={trip.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF9] via-black/10 to-black/30" />
        
        <div className="absolute top-8 left-8">
          <Link to="/" className="font-serif text-2xl text-white drop-shadow-md">Traveloop<sup className="text-xs">®</sup></Link>
        </div>

        <div className="absolute bottom-12 left-8 md:left-12 right-8 md:right-12">
          <div className="max-w-4xl mx-auto animate-fade-rise">
            <p className="text-white/80 font-sans text-xs uppercase tracking-[0.3em] mb-4">A Journey Curated By {trip.first_name} {trip.last_name}</p>
            <h1 className="font-serif text-5xl md:text-8xl text-white font-normal" style={{ letterSpacing: '-3px' }}>
              {trip.name}
            </h1>
            <div className="flex items-center gap-6 mt-8">
              <p className="font-sans text-lg text-white/90">
                {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <div className="h-1 w-12 bg-white/30 rounded-full" />
              <p className="font-sans text-lg text-white/90">{stops.length} Destinations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16">
        <section className="mb-20 animate-fade-rise-delay">
          <h2 className="font-serif text-4xl mb-8 border-b border-foreground/5 pb-6">The Inspiration</h2>
          <p className="font-sans text-xl text-muted leading-relaxed italic">
            "{trip.description || "Every journey is a story waiting to be told. This itinerary captures the essence of exploration and discovery across some of the world's most captivating cities."}"
          </p>
        </section>

        <section className="space-y-16">
          <h2 className="font-serif text-4xl mb-12">The Route</h2>
          {stops.map((stop, i) => (
            <div key={stop.id} className="relative pl-16 animate-fade-rise-delay-2">
              {/* Timeline Track */}
              {i !== stops.length - 1 && (
                <div className="absolute left-[23px] top-12 bottom-[-64px] w-[2px] bg-foreground/5" />
              )}
              {/* Number Circle */}
              <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-white border border-foreground/10 flex items-center justify-center font-serif text-lg shadow-sm">
                {i + 1}
              </div>

              <div className="bg-white rounded-[40px] overflow-hidden border border-foreground/5 shadow-sm hover:shadow-xl transition-all duration-700">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={stop.city_image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'} 
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" 
                    alt={stop.city_name} 
                  />
                </div>
                <div className="p-10">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h3 className="font-serif text-4xl mb-2">{stop.city_name}</h3>
                      <p className="font-sans text-xs text-muted uppercase tracking-[0.2em]">{stop.city_country}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-sm font-medium">{new Date(stop.arrival_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="font-sans text-xs text-muted opacity-60">to {new Date(stop.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>

                  {stop.notes && (
                    <div className="mb-10 p-6 bg-[#FAFAF9] rounded-3xl border-l-4 border-foreground/10 italic text-muted">
                      "{stop.notes}"
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Planned Experiences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activities.filter(a => a.trip_stop_id === stop.id).length === 0 ? (
                        <p className="text-xs text-muted/60 italic">Spontaneous exploration planned.</p>
                      ) : (
                        activities.filter(a => a.trip_stop_id === stop.id).map(act => (
                          <div key={act.id} className="flex items-center gap-4 p-4 bg-[#FAFAF9] rounded-2xl border border-foreground/5">
                            <span className="text-xl">✨</span>
                            <div>
                              <p className="font-sans text-sm font-semibold">{act.activity_name}</p>
                              <p className="font-sans text-[10px] text-muted uppercase">{act.activity_category}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-32 text-center border-t border-foreground/5 pt-16">
          <p className="font-serif text-2xl mb-6">Inspired by this journey?</p>
          <Link 
            to="/register" 
            className="inline-block rounded-full px-10 py-4 bg-foreground text-background font-sans text-sm font-medium hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Start Your Own Story with Traveloop
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default PublicItineraryPage;
