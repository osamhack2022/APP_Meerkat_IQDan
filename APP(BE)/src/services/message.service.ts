import { HttpException } from '@exceptions/HttpException';
import prisma from '../db';
import { isEmpty } from 'class-validator';
import { Message, UsersOnChatrooms } from '@prisma/client';
import { FindMessageDto, IMessageDto, UsersOnChatroomsKeyDto } from '@/dtos/messages.dto';
import ChatroomService from './chatroom.service';

class MessageService {
  /**
   * iMessageDto 있는 chatRoom이 없거나, user가 없거나, user가 chatroom에 없는 경우 throw error
   * @param iMessageDto : 저장할 메시지
   * @returns 저장된 message id
   */
  public async storeMessageAndGetId(iMessageDto: IMessageDto): Promise<number> {
    const chatroom = await prisma.chatroom.findUnique({
      where: {
        chatroomId: iMessageDto.belongChatroomId,
      },
    });
    if (isEmpty(chatroom)) throw new Error('404 Chatroom does not exist.');

    const user = await prisma.user.findUnique({
      where: {
        userId: iMessageDto.senderId,
      },
    });
    if (isEmpty(user)) throw new Error('409 User does not exist');

    const usersOnChatrooms = await prisma.usersOnChatrooms.findUnique({
      where: {
        chatroomId_userId: {
          chatroomId: iMessageDto.belongChatroomId,
          userId: iMessageDto.senderId,
        },
      }
    })
    if (isEmpty(usersOnChatrooms)) throw new Error('403 You are not a member of this chat room.');

    const message = await prisma.message.create({
      data: {
        content: iMessageDto.text,
        sendTime: iMessageDto.sendTime,
        deleteTime: iMessageDto.deleteTime,
        senderId: iMessageDto.senderId,
        belongChatroomId: iMessageDto.belongChatroomId,
      },
    });
    
    return message.messageId;
  }

  /**
   * 인자로 받은 chatRoom이 없거나, user가 없거나, user가 chatroom에 없는 경우 throw error
   * @returns client가 속한 방에서 제일 최근에 읽은 messageId 다음 것부터 끝까지 return.
   */
  public async getUnreadChats(findMessagDto: FindMessageDto): Promise<Message[]> {
    // checking part
    await this.checkUserExists(findMessagDto.userId);
    await this.checkChatroomExists(findMessagDto.chatroomId);
    await this.checkUserInChatroom(findMessagDto.userId, findMessagDto.chatroomId);

    // get unread chats FIXME 
    const unreadChats: Message[] = await prisma.$queryRaw<Message[]>`
    select * from Message m
    where m.messageId >
      (select recentReadMessageId
        from UsersOnChatrooms p
        where p.chatroomId = ${findMessagDto.chatroomId} and p.userId = ${findMessagDto.userId}
      )
      and m.belongChatroomId = ${findMessagDto.chatroomId}
    order by m.messageId asc;`;

    return unreadChats;
  }

  /**
   * 가장 최근에 본 메세지 번호 update 해주기.
   * @param userId
   * @param chatroomId
   * @param messageId
   */
  public async setRecentReadMessage(
    userId: number,
    chatroomId: number,
    messageId: number,
  ): Promise<void> {
    await prisma.usersOnChatrooms.update({
      where: {
        chatroomId_userId: {
          chatroomId: chatroomId,
          userId: userId,
        },
      },
      data: {
        recentReadMessageId: messageId,
      },
    });

    return;
  }

  /**
   * @deprecated setRecentReadMessage로 사용.
   */
  public async updateRecentReadMessage(usersOnChatroomsKeyDto: UsersOnChatroomsKeyDto): Promise<number>{
    // checking part
    await this.checkUserExists(usersOnChatroomsKeyDto.userId);
    await this.checkChatroomExists(usersOnChatroomsKeyDto.chatroomId);
    await this.checkUserInChatroom(usersOnChatroomsKeyDto.userId, usersOnChatroomsKeyDto.chatroomId);

    // update recent read message id FIXME
    const usersOnChatrooms: UsersOnChatrooms = await prisma.$queryRaw<UsersOnChatrooms>`
    update UsersOnChatrooms set recentReadMessageId = (select max(messageId) from Message)
    where chatroomId = {} and userId = {}`;
    return usersOnChatrooms.recentReadMessageId;
  }
  
  /**
   * throw error when user does not exist.
   * @throws HttpException 404 "User does not exist."
   */
  private async checkUserExists(userId: number) {
    const user = await prisma.user.findUnique({ where: { userId: userId } });
    if (isEmpty(user)) throw new HttpException(400, 'User does not exist');
  }

  /**
  * throw error when chatroom does not exist.
  * @throws HttpException 404 "Chatroom does not exist."
  */
  private async checkChatroomExists(chatroomId: number) {
    const chatroom = await prisma.chatroom.findUnique({ where: { chatroomId: chatroomId } });
    if (isEmpty(chatroom)) throw new HttpException(404, 'Chatroom does not exist.');
  }

  /**
   * throw error when user does not exist in chatroom
   * @throws HttpExcpeion 400 "You are not a member of this chat room."
   */
  private async checkUserInChatroom(userId: number, chatroomId: number) {
    const usersOnChatrooms = await prisma.usersOnChatrooms.findUnique({
      where: {
        chatroomId_userId: {
          userId: userId,
          chatroomId: chatroomId,
        },
      }
    })
    if (isEmpty(usersOnChatrooms)) throw new HttpException(403, 'You are not a member of this chat room.');
  }
}

export default MessageService;
