require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Create a pool that allows self-signed certs or no SSL effectively
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function createAdmin() {
  const email = 'ayushgzala@gmail.com';
  const password = 'Admin@123';
  const name = 'Ayush Admin';

  try {
    console.log('Connecting to database (Custom Pool)...');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Check if user exists
    const checkRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (checkRes.rows.length > 0) {
      console.log('User exists. Updating to admin role and resetting password...');
      await pool.query(
        'UPDATE users SET user_type = $1, password_hash = $2, name = $3 WHERE email = $4',
        ['admin', hashedPassword, name, email]
      );
      console.log('Admin user updated successfully.');
    } else {
      console.log('User does not exist. Creating new admin user...');
      const uid = 'admin_' + Date.now();
      await pool.query(
        'INSERT INTO users (uid, email, name, user_type, password_hash, is_verified) VALUES ($1, $2, $3, $4, $5, $6)',
        [uid, email, name, 'admin', hashedPassword, true]
      );
      console.log('Admin user created successfully.');
    }

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
         console.error('Connection refused. Is the database running?');
    } else if (err.message.includes('SSL')) {
         console.error('SSL Error. Retrying without SSL...');
         // Simple retry logic could go here, or just let user know to check config.
         // But for now, let's just log it.
    }
    console.error('Error creating admin user:', err);
  } finally {
    await pool.end();
    process.exit();
  }
}

createAdmin();
