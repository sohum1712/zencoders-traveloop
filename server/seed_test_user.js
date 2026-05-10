const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: './server/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedUser() {
  try {
    const passwordHash = await bcrypt.hash('password123', 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email`,
      ['test@traveloop.com', passwordHash, 'Test', 'User']
    );
    console.log('Test user seeded:', result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding user:', err);
    process.exit(1);
  }
}

seedUser();
