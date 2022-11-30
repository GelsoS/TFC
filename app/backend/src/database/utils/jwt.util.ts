import * as Jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { IUser } from '../interfaces/interface';

dotenv.config();

export function createToken({ id, username, role, email, password }: IUser) {
  const token = Jwt.sign(
    { id, username, role, email, password },
    process.env.JWT_SECRET as string,
  );
  return token;
}

export function validaToken(token: string | undefined) {
  if (!token) return { status: 401, message: 'Token not found' };
  try {
    const { role } = Jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    return { status: undefined, role };
  } catch (error) {
    return { status: 401, message: 'Invalid token' };
  }
}
