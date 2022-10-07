import { PrismaClient, User, Friends, ChatroomType } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class ChatRoomService {
  public chatRoom = new PrismaClient().chatroom;

  public async create1to1Chat(
    userId: number,
    targetUserId: number,
  ): Promise<{ message: string; data: { chatRoomId: string } }> {
    // 이미 존재하는 1to1 채팅방이면 채팅방 id만 돌려보내줍니다.
    const alreadyCount = await this.chatRoom.findMany({
      where: {
        type: ChatroomType.SINGLE
      },
      select: {
        users: {
          where: {
            userId: { equals: userId },
          },
        },
      },
    });
  }
}

export default ChatRoomService;
