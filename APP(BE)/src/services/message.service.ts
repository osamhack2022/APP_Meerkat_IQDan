import prisma from '../db';
import { isEmpty } from 'class-validator';
import { Message, User, UsersOnChatrooms } from '@prisma/client';
import { FindMessageDto, GetReadsDto, GetUnreadsDto, IMessageDto, UsersOnChatroomsKeyDto } from '@/dtos/messages.dto';
import ValidateSerivce from './validate.service';

class MessageService {
  private validateService = new ValidateSerivce();

  /**
   * parameter로 받은 iMessageDto를 DB에 저장하고, messageId를 받아옵니다.
   * @param iMessageDto : 저장할 메시지
   * @throws Error '404 Chatroom does not exist.'
   * @throws Error '409 User does not exist'
   * @throws Error '403 You are not a member of this chat room
   * @returns 저장된 message id
   */
  public async storeMessageAndGetId(iMessageDto: IMessageDto): Promise<number> {
    // validation part
    const chatroom = await prisma.chatroom.findUnique({
      where: {
        chatroomId: iMessageDto.belongChatroomId,
      },
    });
    if (isEmpty(chatroom)) throw new Error('404 Chatroom does not exist');

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
    if (isEmpty(usersOnChatrooms)) throw new Error('403 You are not a member of this chat room');

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

    // set recent message time for chatroom
    await prisma.chatroom.update({
      where: {
        chatroomId: iMessageDto.belongChatroomId
      }, 
      data: {
        lastMessageDate: new Date()
      }
    })
    
    return message.messageId;
  }

  /**
   * @param findMessagDto
   * @throw HttpException "400, User does not exist"
   * @throw HttpException "404, Chatroom does not exist"
   * @throw HttpException "403, You are not a member of this chat room"
   * @returns client가 속한 방에서 제일 최근에 읽은 messageId 다음 것부터 끝까지 return.
   */
  public async getUnreadChats(findMessagDto: FindMessageDto): Promise<Message[]> {
    // checking part
    await this.validateService.checkUserExists(findMessagDto.userId);
    await this.validateService.checkChatroomExists(findMessagDto.chatroomId);
    await this.validateService.checkUserInChatroom(findMessagDto.userId, findMessagDto.chatroomId);

    // FIXME get unread chats
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
   * 가장 최근에 본 messageId를 갱신합니다.
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
   * @deprecated setRecentReadMessage로 사용
   * @see setRecentReadMessage
   */
  public async updateRecentReadMessage(usersOnChatroomsKeyDto: UsersOnChatroomsKeyDto): Promise<number>{
    // checking part
    await this.validateService.checkUserExists(usersOnChatroomsKeyDto.userId);
    await this.validateService.checkChatroomExists(usersOnChatroomsKeyDto.chatroomId);
    await this.validateService.checkUserInChatroom(usersOnChatroomsKeyDto.userId, usersOnChatroomsKeyDto.chatroomId);

    // FIXME update recent read message id 
    const usersOnChatrooms: UsersOnChatrooms = await prisma.$queryRaw<UsersOnChatrooms>`
    update UsersOnChatrooms set recentReadMessageId = (select max(messageId) from Message)
    where chatroomId = {} and userId = {}`;
    return usersOnChatrooms.recentReadMessageId;
  }
  
  /**
   * parameter로 주어진 getUnreadDto의 message를 읽지 않은 사용자 목록을 리턴합니다.
   * @param getUnreadDto 
   * @throw HttpException "404, Chatroom does not exist"
   * @throw HttpException "404, Message does not exist"
   * @returns 메시지를 읽지 않은 사용자 목록
   */
  public async getUnreadUsers(getUnreadDto: GetUnreadsDto): Promise<User[]> {
    // checking part
    await this.validateService.checkChatroomExists(getUnreadDto.chatroomId);
    await this.validateService.checkMessageExists(getUnreadDto.messageId);

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
   * parameter로 주어진 getReadDto의 message를 읽은 사용자 목록을 리턴합니다.
   * @param getReadDto 
   * @throw HttpException "404, Chatroom does not exist"
   * @throw HttpException "404, Message does not exist"
   * @returns 메시지를 읽은 사용자 목록
   */
  public async getReadUsers(getReadDto: GetReadsDto): Promise<User[]> {
    // checking part
    await this.validateService.checkChatroomExists(getReadDto.chatroomId);
    await this.validateService.checkMessageExists(getReadDto.messageId);

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
