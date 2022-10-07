import { PrismaClient, User, Friends, ChatroomType } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { equals } from 'class-validator';

class ChatRoomService {
  public chatRoom = new PrismaClient().chatroom;
  public user = new PrismaClient().user;

  public async create1to1Chat(
    userId: number,
    targetUserId: number,
  ): Promise<number> {
    // 이미 존재하는 1to1 채팅방이면 채팅방 id만 돌려보내줍니다.
    const chatRooms = await this.chatRoom.findMany({
      where: {
        type: ChatroomType.SINGLE,
      },
      select: {
        users: {
          where: {
            userId: userId | targetUserId
          },
          select: {
            chatroomId: true,
            userId: true
          },
        }
      },
    });

    console.log(chatRooms)
    let chatRoomId;
    for (let room of chatRooms) {
      console.log(room.users)
    }

    return chatRoomId
  }

  public async createMultiChat(
    userId: number,
    targetUserId: number[]
  ): Promise<number>{
    
    return 100
  }
}

export default ChatRoomService;
