import { NextFunction, Request, Response } from 'express';
import { Chatroom, Friends, User } from '@prisma/client';
import { RequestWithUser } from '@/interfaces/auth.interface';
import FriendsService from '@services/friends.service';
import ChatroomService from '@/services/chatroom.service';
import { CreateChatroomDto } from '@/dtos/chatroom.dto';

class ChatroomController {
  public friendsService = new FriendsService();
  public chatroomService = new ChatroomService();


  // 내가 속해있는 채팅방 정보 모두 가져오기
  public getMyChatrooms = async(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId =  Number(req.params.id);

    } catch (error) {
      next(error);
    }
  }

  // 특정 채팅방 정보 가져오기
  public getChatroom = async(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId =  req.user.userId
      const chatroomId = Number(req.params.id)
      const chatroomData: Chatroom = await this.chatroomService.getChatRoom(userId, chatroomId)
      res.status(200).json({
        data: chatroomData,
        message: `found the matching chat room`
      })
    } catch (error) {
      next(error);
    }
  }

  public getAllFriends = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const friendsData: User[] = await this.friendsService.findFriendsById(userId);
      res.status(200).json({
        data: friendsData,
        message: `found all friends for the user`,
      });
    } catch (error) {
      next(error);
    }
  };

  public createChat = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { name, targetUserIds, msgExpTime, commanderUserIds } = req.body as CreateChatroomDto;
      let chatroomInfo;
      if (targetUserIds.length === 1) {
        chatroomInfo = await this.chatroomService.create1to1Chat(
          userId,
          targetUserIds[0],
          name,
          msgExpTime,
        );
      } else {
        chatroomInfo = await this.chatroomService.createMultiChat(
          userId,
          targetUserIds,
          name,
          msgExpTime,
          commanderUserIds,
        );
      }
      res.status(200).json({ chatroomInfo });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatroomController;
