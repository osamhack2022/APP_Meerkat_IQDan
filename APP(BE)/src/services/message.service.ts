import { HttpException } from '@exceptions/HttpException';
import prisma from "../db";
import { MessageDto } from '@/interfaces/message.interface';
import { isEmpty } from 'class-validator';

class MessageService {

  /**
   * messageDto에 있는 chatRoom이 없거나, user가 없거나, user가 chatroom에 없는 경우 throw error
   * @param messageDto : 저장할 메시지
   * @returns 저장된 message id
   */
  public async storeMessageAndGetId(messageDto: MessageDto): Promise<number> {
    const chatRoom = await prisma.chatroom.findUnique({
      where: {
        chatroomId: messageDto.belongChatroomId
      }
    });
    if (isEmpty(chatRoom)) throw new Error('404 Chatroom does not exist.');

    const user = await prisma.user.findUnique({
      where: {
        userId: messageDto.senderId
      }
    });
    if (isEmpty(user)) throw new Error('400 You are not exist.');

    const usersOnChatrooms = await prisma.usersOnChatrooms.findUnique({
      where: {
        chatroomId_userId: {
          chatroomId: messageDto.belongChatroomId,
          userId: messageDto.senderId,
        },
      }
    })
    if (isEmpty(usersOnChatrooms)) throw ('400 You are not in that chat.');

    const message = await prisma.message.create({
      data: {
        content: messageDto.content,
        deleteTime: messageDto.deleteTime,
        senderId: messageDto.senderId,
        belongChatroomId: messageDto.belongChatroomId
      }
    });
    return message.messageId;
  }
}

export default MessageService;
