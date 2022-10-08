import { User } from '@prisma/client';

export interface Message {
  userId: number;
  content: string;
  roomId: number;
}