import { Request } from 'express';
import { User } from '@prisma/client';

// token에 저장할 정보
export interface DataStoredInToken {
  id: number;
  name: string;
  serviceNumber: string;
}

// token
export interface TokenData {
  token: string;
  expiresIn: number;
}

// http request에 사용자를 붙인 것
export interface RequestWithUser extends Request {
  user: User;
}
