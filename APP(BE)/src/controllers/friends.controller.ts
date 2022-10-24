import { NextFunction, Response } from 'express';
import { Friends, User } from '@prisma/client';
import { FriendDto } from '@dtos/friends.dto';
import FriendsService from '@services/friends.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

class FriendsController {
  public friendsService = new FriendsService();

  // 나의 친구 목록 가져오기
  public getFriendsById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const findFriendsData: User[] = await this.friendsService.findFriendsById(
        userId,
      );

      res
        .status(200)
        .json({
          data: findFriendsData,
          message: `findFriends by userid ${userId}`,
        });
    } catch (error) {
      next(error);
    }
  };

  // 친구 생성
  public createFriend = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const friendData: FriendDto = {
        followerId: req.user.userId,
        followingId: req.body.followingId,
      };
      const createFriendData: Friends = await this.friendsService.createFriend(
        friendData,
      );

      res.status(201).json({ data: createFriendData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  // 친구 삭제
  public deleteFriend = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const friendData: FriendDto = {
        followerId: req.user.userId,
        followingId: req.body.followingId,
      };
      const deleteUserData: User = await this.friendsService.deleteFriend(
        friendData,
      );

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default FriendsController;
