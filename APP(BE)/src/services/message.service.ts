import { HttpException } from '@exceptions/HttpException';
import prisma from '../db';
import { isEmpty } from 'class-validator';
import { Message, User, UsersOnChatrooms } from '@prisma/client';
import { FindMessageDto, GetReadsDto, GetUnreadsDto, IMessageDto, UsersOnChatroomsKeyDto } from '@/dtos/messages.dto';
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
        hasQuickReply: iMessageDto.hasQuickReplies
      },
    });

    // 내가 보낸 메세지도 최근에 내가 읽은 것으로 표기해주어야함.
    // await this.setRecentReadMessage(message.senderId, message.belongChatroomId, message.messageId) TODO: 이거 나중에 필요 없어지면 지우기.
    
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

  /**
   * throw error when message does not exists
   */
  private async checkMessageExists(messageId: number){
    const message = await prisma.message.findUnique({ where: { messageId: messageId } });
    if (isEmpty(message)) throw new HttpException(404, 'Message does not exist.');
  }

  /**
   * get unread people of given message
   */
  public async getUnreadUsers(getUnreadDto: GetUnreadsDto): Promise<User[]> {
    // checking part
    await this.checkChatroomExists(getUnreadDto.chatroomId);
    await this.checkMessageExists(getUnreadDto.messageId);

    // get unread people of given message
    const unreadUsers: User[] = await prisma.$queryRaw<User[]>`
    select * from
      (
        select * from UsersOnChatrooms p
        where p.chatroomId = ${getUnreadDto.chatroomId}
        and recentReadMessageId < ${getUnreadDto.messageId}
      ) r
    join User u
    on r.userId = u.userId;`;
    return unreadUsers;
  }

    /**
   * get unread people of given message
   */
  public async getReadUsers(getReadDto: GetReadsDto): Promise<User[]> {
    // checking part
    await this.checkChatroomExists(getReadDto.chatroomId);
    await this.checkMessageExists(getReadDto.messageId);

    // get unread people of given message
    const readUsers: User[] = await prisma.$queryRaw<User[]>`
    select * from
      (
        select * from UsersOnChatrooms p
        where p.chatroomId = ${getReadDto.chatroomId}
        and recentReadMessageId >= ${getReadDto.messageId}
      ) r
    join User u
    on r.userId = u.userId;`;
    return readUsers;
  }
}

export default MessageService;
