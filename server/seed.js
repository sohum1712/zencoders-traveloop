const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const email = 'test@traveloop.com';
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    
    // Check if user exists
    const check = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (check.rows.length > 0) {
      await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email]);
      console.log('User password updated.');
    } else {
      await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4)',
        [email, hash, 'Test', 'User']
      );
      console.log('User created.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
