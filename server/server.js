const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation helper
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// AUTH ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, dateOfBirth } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone_number, date_of_birth) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name`,
      [email, passwordHash, firstName, lastName, phoneNumber, dateOfBirth]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user
    const result = await db.query(
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// USER PROFILE ROUTES

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, profile_image_url, phone_number, date_of_birth, created_at 
       FROM users WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      profileImageUrl: user.profile_image_url,
      phoneNumber: user.phone_number,
      dateOfBirth: user.date_of_birth,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, profileImageUrl, phoneNumber, dateOfBirth } = req.body;

    const result = await db.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, profile_image_url = $3, phone_number = $4, date_of_birth = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING id, email, first_name, last_name, profile_image_url, phone_number, date_of_birth`,
      [firstName, lastName, profileImageUrl, phoneNumber, dateOfBirth, req.user.userId]
    );

    const user = result.rows[0];
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImageUrl: user.profile_image_url,
        phoneNumber: user.phone_number,
        dateOfBirth: user.date_of_birth
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TRIP ROUTES

// Get all trips for a user
app.get('/api/trips', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, COUNT(ts.id) as stop_count 
       FROM trips t 
       LEFT JOIN trip_stops ts ON t.id = ts.trip_id 
       WHERE t.user_id = $1 
       GROUP BY t.id 
       ORDER BY t.created_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new trip
app.post('/api/trips', authenticateToken, async (req, res) => {
  try {
    const { name, description, startDate, endDate, coverImageUrl, totalBudget, isPublic } = req.body;

    // Validation
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Name, start date, and end date are required' });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    // Generate public URL if making public
    let publicUrl = null;
    if (isPublic) {
      publicUrl = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    }

    const result = await db.query(
      `INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image_url, total_budget, is_public, public_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.userId, name, description, startDate, endDate, coverImageUrl, totalBudget || 0, isPublic || false, publicUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific trip with details
app.get('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = req.params.id;

    // Check if trip belongs to user
    const tripResult = await db.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, req.user.userId]
    );

    if (tripResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const trip = tripResult.rows[0];

    // Get trip stops with city details
    const stopsResult = await db.query(
      `SELECT ts.*, c.name as city_name, c.country as city_country, c.image_url as city_image
       FROM trip_stops ts 
       LEFT JOIN cities c ON ts.city_id = c.id 
       WHERE ts.trip_id = $1 
       ORDER BY ts.order_index`,
      [tripId]
    );

    // Get activities for each stop
    const activitiesResult = await db.query(
      `SELECT ta.*, a.name as activity_name, a.description as activity_description, a.category as activity_category
       FROM trip_activities ta 
       LEFT JOIN activities a ON ta.activity_id = a.id 
       WHERE ta.trip_stop_id IN (SELECT id FROM trip_stops WHERE trip_id = $1)`,
      [tripId]
    );

    // Get expenses
    const expensesResult = await db.query(
      'SELECT * FROM expenses WHERE trip_id = $1 ORDER BY date_incurred DESC',
      [tripId]
    );

    // Get packing items
    const packingResult = await db.query(
      'SELECT * FROM packing_items WHERE trip_id = $1 ORDER BY category, item_name',
      [tripId]
    );

    // Get notes
    const notesResult = await db.query(
      `SELECT tn.*, ts.arrival_date as stop_date 
       FROM trip_notes tn 
       LEFT JOIN trip_stops ts ON tn.trip_stop_id = ts.id 
       WHERE tn.trip_id = $1 
       ORDER BY tn.note_date DESC`,
      [tripId]
    );

    res.json({
      trip,
      stops: stopsResult.rows,
      activities: activitiesResult.rows,
      expenses: expensesResult.rows,
      packingItems: packingResult.rows,
      notes: notesResult.rows
    });
  } catch (error) {
    console.error('Get trip details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CITY AND ACTIVITY SEARCH

// Search cities
app.get('/api/cities/search', async (req, res) => {
  try {
    const { query, country, minCostIndex, maxCostIndex } = req.query;

    let sqlQuery = 'SELECT * FROM cities WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (query) {
      sqlQuery += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    if (country) {
      sqlQuery += ` AND country ILIKE $${paramIndex}`;
      params.push(`%${country}%`);
      paramIndex++;
    }

    if (minCostIndex) {
      sqlQuery += ` AND cost_index >= $${paramIndex}`;
      params.push(minCostIndex);
      paramIndex++;
    }

    if (maxCostIndex) {
      sqlQuery += ` AND cost_index <= $${paramIndex}`;
      params.push(maxCostIndex);
      paramIndex++;
    }

    sqlQuery += ' ORDER BY popularity_score DESC, name ASC LIMIT 50';

    const result = await db.query(sqlQuery, params);
    res.json(result.rows);
  } catch (error) {
    console.error('City search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all cities (with optional pagination/limit)
app.get('/api/cities', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cities ORDER BY popularity_score DESC LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SAVED DESTINATIONS

// Get user's saved destinations
app.get('/api/user/saved-destinations', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sd.*, c.name as city_name, c.country as city_country, c.image_url as city_image, c.description as city_description
       FROM saved_destinations sd
       JOIN cities c ON sd.city_id = c.id
       WHERE sd.user_id = $1
       ORDER BY sd.created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get saved destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save a destination
app.post('/api/user/saved-destinations', authenticateToken, async (req, res) => {
  try {
    const { cityId } = req.body;
    const result = await db.query(
      'INSERT INTO saved_destinations (user_id, city_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [req.user.userId, cityId]
    );
    res.status(201).json(result.rows[0] || { message: 'Already saved' });
  } catch (error) {
    console.error('Save destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a saved destination
app.delete('/api/user/saved-destinations/:cityId', authenticateToken, async (req, res) => {
  try {
    const { cityId } = req.params;
    await db.query(
      'DELETE FROM saved_destinations WHERE user_id = $1 AND city_id = $2',
      [req.user.userId, cityId]
    );
    res.json({ message: 'Destination removed' });
  } catch (error) {
    console.error('Remove destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search activities
app.get('/api/activities/search', async (req, res) => {
  try {
    const { cityId, category, maxCost, query } = req.query;

    let sqlQuery = `
      SELECT a.*, c.name as city_name, c.country as city_country 
      FROM activities a 
      LEFT JOIN cities c ON a.city_id = c.id 
      WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (cityId) {
      sqlQuery += ` AND a.city_id = $${paramIndex}`;
      params.push(cityId);
      paramIndex++;
    }

    if (category) {
      sqlQuery += ` AND a.category ILIKE $${paramIndex}`;
      params.push(`%${category}%`);
      paramIndex++;
    }

    if (maxCost) {
      sqlQuery += ` AND a.estimated_cost <= $${paramIndex}`;
      params.push(maxCost);
      paramIndex++;
    }

    if (query) {
      sqlQuery += ` AND (a.name ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    sqlQuery += ' ORDER BY a.popularity_score DESC, a.name ASC LIMIT 50';

    const result = await db.query(sqlQuery, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Activity search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TRIP STOPS MANAGEMENT

// Bulk update stops for a trip
app.put('/api/trips/:tripId/itinerary', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { stops } = req.body; // Array of stops

    // 1. Verify trip ownership
    const tripCheck = await db.query(
      'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, req.user.userId]
    );
    if (tripCheck.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });

    // 2. Clear existing stops (simple approach for MVP)
    await db.query('DELETE FROM trip_stops WHERE trip_id = $1', [tripId]);

    // 3. Insert new stops
    if (stops && stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        await db.query(
          `INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, order_index, notes) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [tripId, s.city_id, s.arrival_date || new Date(), s.departure_date || new Date(), i, s.notes || '']
        );
      }
    }

    res.json({ message: 'Itinerary updated successfully' });
  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add activity to stop
app.post('/api/trip-stops/:stopId/activities', authenticateToken, async (req, res) => {
  try {
    const { stopId } = req.params;
    const { activityId, scheduledDate, scheduledTime, notes } = req.body;

    // Verify stop belongs to user's trip
    const stopCheck = await db.query(
      `SELECT ts.id FROM trip_stops ts 
       JOIN trips t ON ts.trip_id = t.id 
       WHERE ts.id = $1 AND t.user_id = $2`,
      [stopId, req.user.userId]
    );

    if (stopCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Stop not found' });
    }

    const result = await db.query(
      `INSERT INTO trip_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [stopId, activityId, scheduledDate, scheduledTime, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// EXPENSES MANAGEMENT

// Add expense
app.post('/api/trips/:tripId/expenses', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { category, description, quantity, unitCost, dateIncurred, paymentMethod, notes } = req.body;

    // Check if trip belongs to user
    const tripCheck = await db.query(
      'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, req.user.userId]
    );

    if (tripCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const totalCost = quantity * unitCost;

    const result = await db.query(
      `INSERT INTO expenses (trip_id, category, description, quantity, unit_cost, total_cost, date_incurred, payment_method, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [tripId, category, description, quantity, unitCost, totalCost, dateIncurred, paymentMethod, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PACKING LIST MANAGEMENT

// Add packing item
app.post('/api/trips/:tripId/packing', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { itemName, category, quantity, notes } = req.body;

    // Check if trip belongs to user
    const tripCheck = await db.query(
      'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, req.user.userId]
    );

    if (tripCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const result = await db.query(
      `INSERT INTO packing_items (trip_id, item_name, category, quantity, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tripId, itemName, category, quantity || 1, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add packing item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update packing item status
app.put('/api/packing-items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { isPacked } = req.body;

    // Verify item belongs to user's trip
    const itemCheck = await db.query(
      `SELECT pi.id FROM packing_items pi 
       JOIN trips t ON pi.trip_id = t.id 
       WHERE pi.id = $1 AND t.user_id = $2`,
      [itemId, req.user.userId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Packing item not found' });
    }

    const result = await db.query(
      'UPDATE packing_items SET is_packed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [isPacked, itemId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update packing item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TRIP NOTES MANAGEMENT

// Add note
app.post('/api/trips/:tripId/notes', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, content, noteDate, tripStopId, isPrivate } = req.body;

    // Check if trip belongs to user
    const tripCheck = await db.query(
      'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, req.user.userId]
    );

    if (tripCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const result = await db.query(
      `INSERT INTO trip_notes (trip_id, trip_stop_id, title, content, note_date, is_private) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [tripId, tripStopId, title, content, noteDate, isPrivate !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUBLIC ITINERARY ACCESS

// Get public trip by URL
app.get('/api/public/itinerary/:url', async (req, res) => {
  try {
    const { url } = req.params;

    const tripResult = await db.query(
      `SELECT t.id, t.name, t.description, t.start_date, t.end_date, 
              u.first_name, u.last_name 
       FROM trips t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.public_url = $1 AND t.is_public = true`,
      [url]
    );

    if (tripResult.rows.length === 0) {
      return res.status(404).json({ error: 'Public itinerary not found' });
    }

    const trip = tripResult.rows[0];

    // Get stops and activities (read-only)
    const stopsResult = await db.query(
      `SELECT ts.*, c.name as city_name, c.country as city_country 
       FROM trip_stops ts 
       LEFT JOIN cities c ON ts.city_id = c.id 
       WHERE ts.trip_id = $1 
       ORDER BY ts.order_index`,
      [trip.id]
    );

    const activitiesResult = await db.query(
      `SELECT ta.*, a.name as activity_name, a.description as activity_description 
       FROM trip_activities ta 
       LEFT JOIN activities a ON ta.activity_id = a.id 
       WHERE ta.trip_stop_id IN (SELECT id FROM trip_stops WHERE trip_id = $1)`,
      [trip.id]
    );

    res.json({
      trip,
      stops: stopsResult.rows,
      activities: activitiesResult.rows
    });
  } catch (error) {
    console.error('Get public itinerary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize database
const initializeDatabase = async () => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const sqlPath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await db.query(sql);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});

module.exports = app;
