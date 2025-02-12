import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../db.js'; // Ensure you have this file properly set up

const SECRET = process.env.JWT_SECRET as string;

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // ✅ Check if user exists in the database
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = userResult.rows[0];

    // ✅ Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // ✅ Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username }, // Payload
      SECRET, // Secret key
      { expiresIn: '1h' } // Expiration time
    );

    // ✅ Send the token as response
    return res.json({ token });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const router = Router();

// ✅ POST /login - Login a user
router.post('/login', login);

export default router;
