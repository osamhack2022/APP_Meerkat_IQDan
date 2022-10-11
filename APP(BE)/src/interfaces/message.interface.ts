export interface IMessageDto {
  _id : number;
  text: string;
  sendTime: Date;
  deleteTime: Date;
  senderId: number;
  belongChatroomId: number;

  isSender:boolean;
}