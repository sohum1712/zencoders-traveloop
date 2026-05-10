const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('--- Starting Production Seed ---');
    await client.query('BEGIN');

    // 1. Clean existing data
    console.log('Cleaning existing data...');
    await client.query('TRUNCATE users, trips, cities, activities, expenses, packing_items, trip_notes, saved_destinations RESTART IDENTITY CASCADE');

    // 2. Create Test User
    const hashedPass = await bcrypt.hash('password123', 10);
    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['test@traveloop.com', hashedPass, 'Test', 'User']
    );
    const userId = userRes.rows[0].id;
    console.log('Test user created.');

    // 3. Insert Varied Cities
    console.log('Inserting unique global cities...');
    const cities = [
      ['Paris', 'France', 'FR', 'City of lights and romance', 120, 95, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'],
      ['Tokyo', 'Japan', 'JP', 'Modern metropolis with traditional charm', 110, 98, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'],
      ['New York', 'USA', 'US', 'The city that never sleeps', 130, 92, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80'],
      ['London', 'UK', 'GB', 'Historic capital with modern attractions', 115, 88, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80'],
      ['Rome', 'Italy', 'IT', 'Eternal city of ancient wonders', 105, 96, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'],
      ['Barcelona', 'Spain', 'ES', 'Vibrant Catalan culture and architecture', 95, 85, 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80'],
      ['Amsterdam', 'Netherlands', 'NL', 'Canals and artistic heritage', 108, 82, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80'],
      ['Dubai', 'UAE', 'AE', 'Modern luxury and desert adventures', 140, 78, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'],
      ['Singapore', 'Singapore', 'SG', 'Garden city with diverse culture', 125, 80, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80'],
      ['Bangkok', 'Thailand', 'TH', 'Street food and golden temples', 75, 83, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80'],
      ['Bali', 'Indonesia', 'ID', 'Tropical paradise with ancient temples', 70, 91, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'],
      ['Santorini', 'Greece', 'GR', 'Iconic white-washed villages', 110, 89, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80'],
      ['Sydney', 'Australia', 'AU', 'Harbour city with iconic Opera House', 120, 85, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80'],
      ['Reykjavik', 'Iceland', 'IS', 'Land of fire and ice', 130, 84, 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80'],
      ['Cairo', 'Egypt', 'EG', 'Ancient pyramids and history', 60, 75, 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=80']
    ];

    const cityIds = [];
    for (const city of cities) {
      const res = await client.query(
        `INSERT INTO cities (name, country, country_code, description, cost_index, popularity_score, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        city
      );
      cityIds.push(res.rows[0].id);
    }

    // 4. Insert Activities
    console.log('Inserting global activities...');
    const activities = [
      [cityIds[0], 'Eiffel Tower', 'Visit the iron lady', 'Sightseeing', 25, 120],
      [cityIds[1], 'Shibuya Crossing', 'Busy urban experience', 'Urban', 0, 30],
      [cityIds[2], 'Central Park', 'Green lungs of NYC', 'Nature', 0, 180],
      [cityIds[4], 'Colosseum', 'Ancient gladiator arena', 'History', 20, 150],
      [cityIds[10], 'Uluwatu Temple', 'Cliffside sunset temple', 'Culture', 5, 90]
    ];

    for (const act of activities) {
      await client.query(
        `INSERT INTO activities (city_id, name, description, category, estimated_cost, estimated_duration) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        act
      );
    }

    // 5. Create a Sample Trip
    console.log('Creating sample trip for test user...');
    const tripRes = await client.query(
      `INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image_url, total_budget, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [userId, 'Summer in Tokyo', 'Exploring the neon lights of Shinjuku', '2026-07-01', '2026-07-15', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80', 5000, 'planning']
    );
    const tripId = tripRes.rows[0].id;

    // Add a stop to the trip
    await client.query(
      `INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, order_index, notes) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [tripId, cityIds[1], '2026-07-01', '2026-07-15', 1, 'Main stay at Shinjuku']
    );

    await client.query('COMMIT');
    console.log('--- Seeding Completed Successfully ---');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed Error:', e);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
