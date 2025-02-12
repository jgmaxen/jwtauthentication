import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

const SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    req.user = decoded; // ✅ Attach user data
    return next(); // ✅ Ensure `next()` is called
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
