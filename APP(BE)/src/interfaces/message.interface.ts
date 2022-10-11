export interface MessageDto {
  messageId: number;

  belongChatroomId: number;
  senderId: number;

  content: string;
  deleteTime: Date;
}