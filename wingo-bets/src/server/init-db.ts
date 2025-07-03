import pool from './db.js';

async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        event_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create wingo_transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wingo_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        event_id INTEGER REFERENCES events(id),
        amount INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create index for fast balance calculation
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_wingo_transactions_user_id 
      ON wingo_transactions(user_id);
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    pool.end();
  }
}

initializeDatabase(); 