import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error(
    'Please define the JWT_SECRET environment variable inside .env.local'
  );
}

interface TokenPayload {
  userId: string;
  name: string;
  email: string;
}

// Create a JWT token
export const createToken = (user: IUser): string => {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  // Fix jwt.sign type issue
  return jwt.sign(payload, JWT_SECRET);
};

// Verify a JWT token
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Extract token from request
export const getTokenFromRequest = (req: NextRequest): string | null => {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
};

// Authentication middleware function for API routes
export const authenticate = async (req: NextRequest) => {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const decoded = verifyToken(token);
    return decoded;
  } catch (error: any) {
    throw new Error(error.message || 'Authentication failed');
  }
};