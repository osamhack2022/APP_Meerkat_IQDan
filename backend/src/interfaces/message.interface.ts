import { User } from '@prisma/client';

export interface Message {
  user: User;
  content: string;
  room: string;
}