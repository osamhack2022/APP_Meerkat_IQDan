import { HttpException } from '@exceptions/HttpException';
import prisma from "../db";
import { IMessageDto } from '@/interfaces/message.interface';
import { isEmpty } from 'class-validator';
import { Message } from '@prisma/client';
import { FindMessageDto } from '@/dtos/messages.dto';

class MessageService {
  /**
   * messageDto에 있는 chatRoom이 없거나, user가 없거나, user가 chatroom에 없는 경우 throw error
   * @param messageDto : 저장할 메시지
   * @returns 저장된 message id
   */
  public async storeMessageAndGetId(messageDto: IMessageDto): Promise<number> {
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
    if (isEmpty(usersOnChatrooms)) throw new Error('400 You are not in that chat.');

    const message = await prisma.message.create({
      data: {
        content: messageDto.text,
        sendTime: messageDto.sendTime,
        deleteTime: messageDto.deleteTime,
        senderId: messageDto.senderId,
        belongChatroomId: messageDto.belongChatroomId
      }
    });
    return message.messageId;
  }

  /**
   * 인자로 받은 chatRoom이 없거나, user가 없거나, user가 chatroom에 없는 경우 throw error
   * @returns client가 속한 방에서 제일 최근에 읽은 messageId 다음 것부터 끝까지 return.
   */
  public async getUnreadChats(findMessagDto: FindMessageDto): Promise<Message[]> {
    const chatRoom = await prisma.chatroom.findUnique({
      where: {
        chatroomId: findMessagDto.chatroomId
      }
    });
    if (isEmpty(chatRoom)) throw new HttpException(404, 'Chatroom does not exist.');

    const user = await prisma.user.findUnique({
      where: {
        userId: findMessagDto.userId
      }
    });
    if (isEmpty(user)) throw new HttpException(400, 'You are not exist.');

    const usersOnChatrooms = await prisma.usersOnChatrooms.findUnique({
      where: {
        chatroomId_userId: {
          chatroomId: findMessagDto.chatroomId,
          userId: findMessagDto.userId
        },
      }
    })
    if (isEmpty(usersOnChatrooms)) throw new HttpException(400, 'You are not in that chat.');

    const unreadChats: Message[] = await prisma.$queryRaw<Message[]>`
    select * from Message m
    where m.messageId >
      (select recentReadMessageId
        from UsersOnChatrooms p
        where p.chatroomId = ${findMessagDto.chatroomId} and p.userId = ${findMessagDto.userId}
      )
      and m.belongChatroomId = ${findMessagDto.chatroomId}
    order by m.messageId asc;`

    
        console.log(unreadChats);
    return unreadChats;
  }
}

export default MessageService;
