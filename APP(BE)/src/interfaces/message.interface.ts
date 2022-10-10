import { User } from '@prisma/client';

export interface MessageDto {
  content: string;
  roomId: number;
}