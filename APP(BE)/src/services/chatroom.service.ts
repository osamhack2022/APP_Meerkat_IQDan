import { PrismaClient, Chatroom } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { equals } from 'class-validator';


// 채팅방 한 개 불러오기 
class ChatroomService {
  public prisma = new PrismaClient();

  public async getChatRoom(
    userId: number,
    chatroomId: number
  ): Promise<Chatroom> {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        chatroomId: chatroomId
      }
    })

    // 해당 request를 보낸 유저가 그 방의 멤버인지 확인합니다.
    const members = await this.prisma.usersOnChatrooms.findMany({
      where:{
        chatroomId: chatroom.chatroomId
      }
    })
    const i = members.findIndex(e => e.userId === userId)
    if (i === -1) {
      throw new HttpException(403, 'You are not a member of this chat room.')
    }
    return chatroom
  }


  // 1대1채팅방 생성
  public async create1to1Chat(
    userId: number,
    targetUserId: number,
    name: string,
    msgExpTime: number
  ): Promise<{alreadyExists: boolean, chatroomId: number}> {
    // 이미 존재하는 1to1 채팅방이면 기존 채팅방 id를 돌려보내줍니다.
    let chatroomIdObjs: {chatroomId: number}[] = await this.prisma.$queryRaw`Select A.chatroomId
    from Chatroom A join UsersOnChatrooms B on A.chatroomId=B.chatroomId
    where B.userId = ${userId} AND A.chatroomId IN (
          select A.chatroomId
          from Chatroom A join UsersOnChatrooms B on A.chatroomId=B.chatroomId
          where A.type = 'single' and B.userId = ${targetUserId}
    );`

    // 이미 존재하는 채팅방은 바로 리턴.
    if (chatroomIdObjs.length !== 0) {
      return {chatroomId: chatroomIdObjs[0].chatroomId, alreadyExists: true}
    }

    // 존재하지 않는 채팅방이면 채팅방을 만듭니다.
    // 채팅방 생성
    let newChatroom: Chatroom = await this.prisma.chatroom.create({
      data: {
        name: name,
        type: 'SINGLE',
        msgExpTime: msgExpTime
      }
    })

    // 채팅방 인원 생성
    await this.prisma.usersOnChatrooms.create({
      data: {
        chatroomId: newChatroom.chatroomId,
        userId: userId
      }
    })
    await this.prisma.usersOnChatrooms.create({
      data: {
        chatroomId: newChatroom.chatroomId,
        userId: targetUserId
      }
    })
    
    console.log(newChatroom)

    return {chatroomId: newChatroom.chatroomId, alreadyExists: false}
  }

  // 여러명 있는 채팅방 생성
  public async createMultiChat(
    userId: number,
    targetUserId: number[],
    name: string,
    msgExpTime: number,
    commanderUserIds: number[]
  ): Promise<number>{
    
    return 100
  }

  // 여러명 있는 채팅방에 초대하기
  public async inviteToChat() {

    // 1대1 채팅방이라면 reject

  }
}

export default ChatroomService;
