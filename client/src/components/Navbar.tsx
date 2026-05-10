import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-transparent">
      <div className="w-full max-w-7xl px-8 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-3xl tracking-tight font-serif text-foreground">
            Traveloop<sup className="text-xs ml-0.5">®</sup>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-sans text-foreground transition-colors hover:text-foreground/80">
            Home
          </Link>
          <Link to="/destinations" className="text-sm font-sans text-muted transition-colors hover:text-foreground">
            Destinations
          </Link>
          <Link to="/trips" className="text-sm font-sans text-muted transition-colors hover:text-foreground">
            My Trips
          </Link>
          <Link to="/journal" className="text-sm font-sans text-muted transition-colors hover:text-foreground">
            Journal
          </Link>
          <Link to="/contact" className="text-sm font-sans text-muted transition-colors hover:text-foreground">
            Reach Us
          </Link>
        </div>

        <div>
          <Link 
            to="/login"
            className="rounded-full px-6 py-2.5 text-sm font-sans bg-foreground text-background transition-transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Begin Journey
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
