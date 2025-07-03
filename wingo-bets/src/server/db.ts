import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Use default database first
  password: 'postgres', // Common default password
  port: 5432,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

export default pool; 