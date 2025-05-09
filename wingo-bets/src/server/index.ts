import express, { Request, Response, Router, RequestHandler } from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const router = Router();
const port = 3001; // Different from your Vite dev server

app.use(cors());
app.use(express.json());
app.use('/api', router);

// Helper: Get user balance
async function getUserBalance(userId: number) {
  const { rows } = await pool.query(
    'SELECT COALESCE(SUM(amount),0) AS balance FROM wingo_transactions WHERE user_id = $1',
    [userId]
  );
  return parseInt(rows[0].balance, 10);
}

interface WingoTransaction {
  userId: number;
  amount: number;
  description?: string;
  eventId?: number;
}

// 1. Award WINGOs
const awardWingos: RequestHandler = async (req, res) => {
  try {
    const { userId, amount, description, eventId } = req.body as WingoTransaction;
    if (amount <= 0) {
      res.status(400).json({ error: 'Amount must be positive' });
      return;
    }
    
    await pool.query(
      'INSERT INTO wingo_transactions (user_id, event_id, amount, type, description) VALUES ($1, $2, $3, $4, $5)',
      [userId, eventId || null, amount, 'award', description || null]
    );
    
    const newBalance = await getUserBalance(userId);
    res.json({ success: true, newBalance });
  } catch (error) {
    console.error('Error awarding WINGOs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Spend WINGOs
const spendWingos: RequestHandler = async (req, res) => {
  try {
    const { userId, amount, description, eventId } = req.body as WingoTransaction;
    if (amount <= 0) {
      res.status(400).json({ error: 'Amount must be positive' });
      return;
    }
    
    const balance = await getUserBalance(userId);
    if (balance < amount) {
      res.status(400).json({ error: 'Insufficient WINGO balance' });
      return;
    }
    
    await pool.query(
      'INSERT INTO wingo_transactions (user_id, event_id, amount, type, description) VALUES ($1, $2, $3, $4, $5)',
      [userId, eventId || null, -amount, 'spend', description || null]
    );
    
    const newBalance = await getUserBalance(userId);
    res.json({ success: true, newBalance });
  } catch (error) {
    console.error('Error spending WINGOs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 3. Get balance and transaction history
const getHistory: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { rows: transactions } = await pool.query(
      'SELECT * FROM wingo_transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    const balance = await getUserBalance(userId);
    res.json({ balance, transactions });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/wingo/award', awardWingos);
router.post('/wingo/spend', spendWingos);
router.get('/wingo/history/:userId', getHistory);

app.listen(port, () => {
  console.log(`WINGO server running at http://localhost:${port}`);
}); 