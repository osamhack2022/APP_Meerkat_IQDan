import { Chatroom, User } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { equals } from 'class-validator';
import prisma from '../db';
import { ChatroomWithKey } from '../interfaces/chatroom.interface';
import { ChatroomAndNumOfUnreadMessagesDto } from '@/dtos/chatroom.dto';

class ChatroomService {
  /**
   * 내가 속해있는 모든 채팅방 가져오기
   * @param userId
   * @returns 내가 들어있는 모든 채팅방 정보
   */
  public async getMyChatrooms(userId: number): Promise<Chatroom[]> {
    const chatrooms = await prisma.chatroom.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return chatrooms;
  }


  /**
   * 유저가 그 방의 멤버인지 확인합니다.
   * @param chatroomId 
   * @param userId 
   */
  public async checkUserIsInChatroom (chatroomId: number, userId: number) {
    const members = await prisma.usersOnChatrooms.findMany({
      where: {
        chatroomId: chatroomId,
      },
    });
    const i = members.findIndex(e => e.userId === userId);
    if (i === -1) {
      throw new HttpException(403, 'You are not a member of this chat room.');
    }
  }

  /**
   * 내가 속한 모든 채팅방 + 안읽은 메시지 개수
   * @param userId
   * @returns 내가 들어있는 모든 채팅방 정보 + 안읽은 메시지 개수
   */
   public async getMyChatroomsAndNumOfUnreads(userId: number): Promise<ChatroomAndNumOfUnreadMessagesDto[]> {
    const result: any = await prisma.$queryRaw<Object[]>`
    select *, case when r.cnt>0 then r.cnt-1 else 0 end as numUnreadMessages
    from(
      select chatroomId, NVL(count(r.messageId), 1) as cnt
      from (
        select *
        from UsersOnChatrooms p left join Message m
        on p.chatroomId = m.belongChatroomId
        where p.userId = ${userId}
      ) r
      where NVL(r.messageId, -1) >= r.recentReadMessageId
      group by r.chatroomId
    ) r join Chatroom c on r.chatroomId = c.chatroomId`;

    const parseBigIntResult: ChatroomAndNumOfUnreadMessagesDto[] = result.map((value)=>{
      value.numUnreadMessages = Number(value.numUnreadMessages.toString());
      return value;
    });

    return parseBigIntResult;
  }


  /**
   * 특정 채팅방 정보 불러오기
   * @param userId
   * @param chatroomId
   * @returns 하나의 채팅방 정보. encryptedKey없으면 encryptedKey: null로 넘어감.
   */
  public async getChatroom(userId: number, chatroomId: number): Promise<ChatroomWithKey> {
    const chatroom = await prisma.chatroom.findUnique({
      where: {
        chatroomId: chatroomId,
      },
    });

    // 해당 request를 보낸 유저가 그 방의 멤버인지 확인합니다.
    await this.checkUserIsInChatroom(chatroom.chatroomId, userId)

    // 해당 방에서 나의 키를 찾아서 반환합니다.
    const myRoomKey = await prisma.chatroomKey.findUnique({
      where: {
        forUserId_forChatroomId: {
          forUserId: userId,
          forChatroomId: chatroomId,
        },
      },
      select: {
        encryptedKey: true,
      },
    });

    // myRoomKey 안에 encryptedKey가 없을 경우 null로 넘어감.
    const chatroomWithKey = {
      ...chatroom,
      encryptedKey: myRoomKey === null ? null : myRoomKey.encryptedKey,
    };

    return chatroomWithKey;
  }

  /**
   * 특정 채팅방에 속한 모든 유저정보 불러오기
   * @param userId
   * @param chatroomId
   */
  public async getAllUsersInChat(
    userId: number,
    chatroomId: number,
  ): Promise<{ userId: number; name: string; image: string }[]> {
    const userIds = await prisma.usersOnChatrooms.findMany({
      where: {
        chatroomId: chatroomId,
      },
      select: {
        userId: true,
      },
    });

    await this.checkUserIsInChatroom(chatroomId, userId)

    const usersInfo = await Promise.all(
      userIds.map(id =>
        prisma.user.findUnique({
          where: {
            userId: id.userId,
          },
          select: {
            userId: true,
            name: true,
            image: true,
          },
        }),
      ),
    );

    return usersInfo;
  }

  /**
   * 1대1 채팅방 생성
   * @param userId
   * @param targetUserId
   * @param name
   * @param msgExpTime
   * @returns 추가된 채팅방 chatroomId 혹은 이미 존재하는 채팅방 chatroomId
   */
  public async create1to1Chat(
    userId: number,
    targetUserId: number,
    name: string,
    msgExpTime: number,
    removeAfterRead: boolean,
  ): Promise<{ alreadyExists: boolean; chatroomId: number }> {
    // 이미 존재하는 1to1 채팅방이면 기존 채팅방 id를 돌려보내줍니다.
    let chatroomIdObjs: { chatroomId: number }[] = await prisma.$queryRaw`Select A.chatroomId
    from Chatroom A join UsersOnChatrooms B on A.chatroomId=B.chatroomId
    where B.userId = ${userId} AND A.chatroomId IN (
          select A.chatroomId
          from Chatroom A join UsersOnChatrooms B on A.chatroomId=B.chatroomId
          where A.type = 'single' and B.userId = ${targetUserId}
    );`;

    // 이미 존재하는 채팅방은 바로 리턴.
    if (chatroomIdObjs.length !== 0) {
      return { chatroomId: chatroomIdObjs[0].chatroomId, alreadyExists: true };
    }

    // 존재하지 않는 채팅방이면 채팅방을 만듭니다.
    // 채팅방 생성
    let newChatroom: Chatroom = await prisma.chatroom.create({
      data: {
        name: name,
        type: 'SINGLE',
        msgExpTime: msgExpTime,
        removeAfterRead: removeAfterRead,
      },
    });

    // 채팅방 인원 생성
    await prisma.usersOnChatrooms.create({
      data: {
        chatroomId: newChatroom.chatroomId,
        userId: userId,
      },
    });
    await prisma.usersOnChatrooms.create({
      data: {
        chatroomId: newChatroom.chatroomId,
        userId: targetUserId,
      },
    });

    return { chatroomId: newChatroom.chatroomId, alreadyExists: false };
  }

  /**
   * 채팅방 생성
   * @param userId
   * @param targetUserId
   * @param name
   * @param msgExpTime
   * @param commanderUserIds
   * @returns 추가된 채팅방 chatroomId
   */
  public async createMultiChat(
    userId: number,
    targetUserId: number[],
    name: string,
    msgExpTime: number,
    commanderUserIds: number[],
    removeAfterRead: boolean,
  ): Promise<{ chatroomId: number; alreadyExists: boolean }> {
    // 누가 참여하는가와 상관 없이 새로운 채팅방을 만듭니다.
    let newChatroom: Chatroom = await prisma.chatroom.create({
      data: {
        name: name,
        type: 'MULTI',
        msgExpTime: msgExpTime,
        removeAfterRead: removeAfterRead,
      },
    });

    // 방에 유저 추가
    await Promise.all(
      [userId, ...targetUserId].map(id => {
        return prisma.usersOnChatrooms.create({
          data: {
            userId: id,
            chatroomId: newChatroom.chatroomId,
          },
        });
      }),
    );

    // 상급자 추가
    await Promise.all(
      commanderUserIds.map(id => {
        return prisma.chatroomCommanders.create({
          data: {
            userId: id,
            chatroomId: newChatroom.chatroomId,
          },
        });
      }),
    );

    // IF: 트랜잭션 형식으로 만들 수 있으면 더 좋을듯.

    return { chatroomId: newChatroom.chatroomId, alreadyExists: false };
  }

  /**
   * 여러명 있는 채팅방에 초대하기
   * @param userId
   * @param chatroomId
   * @param targetUserIds
   * @returns nothing
   */
  public async inviteToChat(
    userId: number, // 나중에 E2EE 추가할 때 필요함.
    chatroomId: number,
    targetUserIds: number[],
  ): Promise<void> {
    // 1대1 채팅방이라면 reject
    const chatroom = await prisma.chatroom.findUnique({
      where: {
        chatroomId: chatroomId,
      },
    });
    if (chatroom.type === 'SINGLE') {
      throw new HttpException(400, 'You cannot invite people to 1 to 1 chatrooms.');
    }
    // 아니라면 초대하기.
    await Promise.all(
      targetUserIds.map(id => {
        return prisma.usersOnChatrooms.create({
          data: {
            chatroomId: chatroomId,
            userId: id,
          },
        });
      }),
    );

    return;
  }

  /**
   * 채팅방 떠나기.
   * 1대1 채팅은 프런트에서 떠나도 백엔드에서 아무조치를 해주지 않음.
   * 아래 leaveChat은 오로지 MULTI 채팅방만 떠나는 용도임.
   * @param userId
   * @param chatroomId
   * @returns nothing
   */
  public async leaveChat(userId: number, chatroomId: number): Promise<void> {
    const chatroom = await prisma.chatroom.findUnique({
      where: {
        chatroomId: chatroomId,
      },
    });
    if (chatroom.type === 'SINGLE') {
      throw new HttpException(400, 'You cannot leave 1 to 1 chat here.');
    }

    const record = await prisma.usersOnChatrooms.findUnique({
      where: {
        chatroomId_userId: {
          chatroomId: chatroomId,
          userId: userId,
        },
      },
    });

    if (record === null) {
      throw new HttpException(400, 'You are not in this chat.');
    }

    await prisma.usersOnChatrooms.delete({
      where: {
        chatroomId_userId: {
          chatroomId: chatroomId,
          userId: userId,
        },
      },
    });

    return;
  }

  /**
   * 채팅방 제목이나 메시지 삭제 시간 수정시 사용되는 함수.
   * @deprecated 모든 채팅방이랑 메시지는 처음에만 설정 가능하고 수정 불가능한 것으로 설계 변경.
   * => 시간 남으면 구현.
   */
  public async UpdateChatroom(
    userId: number,
    chatroomId: number,
    name: string,
    msgExpTime: number,
    removeAfterRead: boolean,
  ): Promise<void> {
    throw new HttpException(400, 'This function is deprecated');
    // check if user is in the chat
    const userInChatroom = await prisma.usersOnChatrooms.findUnique({
      where: {
        chatroomId_userId: {
          chatroomId: chatroomId,
          userId: userId,
        },
      },
    });

    if (userInChatroom === null) {
      throw new HttpException(403, 'You are not in this chat.');
    }

    await prisma.chatroom.update({
      where: {
        chatroomId: chatroomId,
      },
      data: {
        name: name,
        msgExpTime: msgExpTime,
      },
    });

    return;
  }

  /**
   * 개인이 남들을 방에 초대할 때 만든 암호화된 키들을 db에 저장.
   */
  public async putChatroomKey(
    userId: number,
    chatroomId: number,
    encrypedKey: string,
  ): Promise<void> {
    await prisma.chatroomKey.create({
      data: {
        forUserId: userId,
        forChatroomId: chatroomId,
        encryptedKey: encrypedKey,
      },
    });

    return;
  }


  /**
   * 특정 채팅방의 나의 암호화된 키를 가져오기.
   */
  public async getChatroomKey(
    userId: number,
    chatroomId: number
  ): Promise<string> {
    const res = await prisma.chatroomKey.findUnique({
      where: {
        forUserId_forChatroomId: {
          forUserId: userId,
          forChatroomId: chatroomId
        }
      }
    })
    return res.encryptedKey
  }
  
}

export default ChatroomService;
