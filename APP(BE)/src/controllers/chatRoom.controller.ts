import { NextFunction, Request, Response } from 'express';
import { Friends, User } from '@prisma/client';
import { RequestWithUser } from '@/interfaces/auth.interface';
import FriendsService from '@services/friends.service';
import ChatRoomService from '@/services/chatRoom.service';

class ChatRoomController {
  public friendsService = new FriendsService();
  public chatRoomService = new ChatRoomService();

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

  public create1to1Chat = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { targetUserId } = req.body;
      const chatRoomInfo = await this.chatRoomService.create1to1Chat(userId, targetUserId);
      res.status(200).json({ chatRoomInfo });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatRoomController;
