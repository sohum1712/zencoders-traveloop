import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TripsListPage from './pages/TripsListPage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailPage from './pages/TripDetailPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import ProfilePage from './pages/ProfilePage';
import DestinationsPage from './pages/DestinationsPage';
import PublicItineraryPage from './pages/PublicItineraryPage';
import CommunityPage from './pages/CommunityPage';
import AdminPage from './pages/AdminPage';
import BillingPage from './pages/BillingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shared/:shareUrl" element={<PublicItineraryPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><TripsListPage /></ProtectedRoute>} />
          <Route path="/trips/new" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
          <Route path="/trips/:tripId" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
          <Route path="/trips/:tripId/itinerary" element={<ProtectedRoute><ItineraryBuilderPage /></ProtectedRoute>} />
          <Route path="/trips/:tripId/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
          
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/destinations" element={<ProtectedRoute><DestinationsPage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen font-sans">
              <p className="font-serif text-6xl font-normal mb-4">404</p>
              <p className="text-muted mb-6">Page not found</p>
              <a href="/" className="rounded-full px-6 py-3 bg-foreground text-background text-sm hover:bg-foreground/90 transition">Go Home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
