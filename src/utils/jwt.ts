import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../entities/User';

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

const SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET) as TokenPayload;
}