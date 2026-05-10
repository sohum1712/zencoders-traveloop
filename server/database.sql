-- Traveloop Database Schema
-- PostgreSQL Schema for Travel Planning Application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image_url VARCHAR(500),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_image_url VARCHAR(500),
    total_budget DECIMAL(10,2) DEFAULT 0.00,
    is_public BOOLEAN DEFAULT FALSE,
    public_url VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'planning', -- planning, ongoing, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities table (for city search)
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    description TEXT,
    cost_index INTEGER DEFAULT 100, -- relative cost index
    popularity_score INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Stops (cities in a trip)
CREATE TABLE IF NOT EXISTS trip_stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id),
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    order_index INTEGER NOT NULL, -- order of stops in trip
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- adventure, cultural, food, sightseeing, etc.
    estimated_cost DECIMAL(10,2) DEFAULT 0.00,
    estimated_duration INTEGER, -- in minutes
    image_url VARCHAR(500),
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Activities (activities added to trip stops)
CREATE TABLE IF NOT EXISTS trip_activities (
    id SERIAL PRIMARY KEY,
    trip_stop_id INTEGER REFERENCES trip_stops(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    notes TEXT,
    actual_cost DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'planned', -- planned, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- transport, accommodation, food, activities, shopping, other
    description VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    date_incurred DATE,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packing Checklist
CREATE TABLE IF NOT EXISTS packing_items (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- documents, clothing, electronics, toiletries, etc.
    quantity INTEGER DEFAULT 1,
    is_packed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Notes/Journal
CREATE TABLE IF NOT EXISTS trip_notes (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    trip_stop_id INTEGER REFERENCES trip_stops(id) ON DELETE SET NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    note_date DATE NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved Destinations (user's favorite cities)
CREATE TABLE IF NOT EXISTS saved_destinations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, city_id)
);

-- Admin/Users table for admin access
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin',
    permissions TEXT, -- JSON string of permissions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics/Stats table (for admin dashboard)
CREATE TABLE IF NOT EXISTS platform_stats (
    id SERIAL PRIMARY KEY,
    stat_date DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    total_trips INTEGER DEFAULT 0,
    active_trips INTEGER DEFAULT 0,
    new_signups INTEGER DEFAULT 0,
    top_cities TEXT, -- JSON array of top cities
    top_activities TEXT, -- JSON array of top activities
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stat_date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_trip_stop_id ON trip_activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON activities(city_id);
CREATE INDEX IF NOT EXISTS idx_trip_notes_trip_id ON trip_notes(trip_id);

-- Insert sample data for cities
INSERT INTO cities (name, country, country_code, description, cost_index, popularity_score, image_url) VALUES
('Paris', 'France', 'FR', 'City of lights and romance', 120, 95, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80'),
('Tokyo', 'Japan', 'JP', 'Modern metropolis with traditional charm', 110, 90, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80'),
('New York', 'USA', 'US', 'The city that never sleeps', 130, 92, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80'),
('London', 'United Kingdom', 'GB', 'Historic capital with modern attractions', 115, 88, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80'),
('Rome', 'Italy', 'IT', 'Eternal city of ancient wonders', 105, 87, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80'),
('Barcelona', 'Spain', 'ES', 'Vibrant Catalan culture and architecture', 95, 85, 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80'),
('Amsterdam', 'Netherlands', 'NL', 'Canals and artistic heritage', 108, 82, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80'),
('Dubai', 'UAE', 'AE', 'Modern luxury and desert adventures', 140, 78, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80'),
('Singapore', 'Singapore', 'SG', 'Garden city with diverse culture', 125, 80, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80'),
('Bangkok', 'Thailand', 'TH', 'Street food and golden temples', 75, 83, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80'),
('Bali', 'Indonesia', 'ID', 'Tropical paradise with ancient temples and rice terraces', 70, 91, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80'),
('Santorini', 'Greece', 'GR', 'Iconic white-washed villages and blue domes', 110, 89, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80'),
('Kyoto', 'Japan', 'JP', 'Traditional Japanese culture and bamboo forests', 100, 86, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80'),
('Marrakech', 'Morocco', 'MA', 'Vibrant markets and stunning riads', 60, 79, 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=400&q=80'),
('Cape Town', 'South Africa', 'ZA', 'Where mountains meet the ocean', 80, 77, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80'),
('Lisbon', 'Portugal', 'PT', 'Hilly coastal city with pastel buildings', 85, 84, 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80'),
('Prague', 'Czech Republic', 'CZ', 'Fairytale architecture and vibrant nightlife', 75, 81, 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400&q=80'),
('Istanbul', 'Turkey', 'TR', 'Where East meets West across the Bosphorus', 70, 83, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80'),
('Sydney', 'Australia', 'AU', 'Harbour city with iconic Opera House', 120, 85, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80'),
('Maldives', 'Maldives', 'MV', 'Crystal-clear waters and overwater villas', 180, 88, 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80')
ON CONFLICT DO NOTHING;

-- Insert sample activities for Paris
INSERT INTO activities (city_id, name, description, category, estimated_cost, estimated_duration) VALUES
(1, 'Eiffel Tower Visit', 'Visit the iconic Eiffel Tower and enjoy panoramic views', 'sightseeing', 25.00, 120),
(1, 'Louvre Museum', 'Explore world-famous art including the Mona Lisa', 'cultural', 17.00, 180),
(1, 'Seine River Cruise', 'Romantic boat tour along the Seine', 'adventure', 15.00, 90),
(1, 'French Cooking Class', 'Learn to make traditional French cuisine', 'food', 85.00, 240),
(1, 'Versailles Day Trip', 'Visit the magnificent Palace of Versailles', 'cultural', 35.00, 300)
ON CONFLICT DO NOTHING;

-- Insert sample activities for Tokyo
INSERT INTO activities (city_id, name, description, category, estimated_cost, estimated_duration) VALUES
(2, 'Senso-ji Temple', 'Visit Tokyo''s oldest Buddhist temple', 'cultural', 0.00, 60),
(2, 'Tsukiji Fish Market', 'Experience the famous fish market and fresh sushi', 'food', 30.00, 120),
(2, 'Shibuya Crossing', 'Witness the world''s busiest pedestrian crossing', 'sightseeing', 0.00, 30),
(2, 'Mount Fuji Day Trip', 'Day trip to see Japan''s iconic mountain', 'adventure', 120.00, 480),
(2, 'Robot Restaurant Show', 'Experience the futuristic robot show', 'entertainment', 80.00, 90)
ON CONFLICT DO NOTHING;

