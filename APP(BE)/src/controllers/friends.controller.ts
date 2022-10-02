import { NextFunction, Request, Response } from 'express';
import { Friends,User } from '@prisma/client';
import { FriendDto } from '@dtos/friends.dto';
import FriendsService from '@services/friends.service';

class UsersController {
  public friendsService = new FriendsService();

  public getFriendsById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findFriendsData: User[] = await this.friendsService.findFriendsById(userId);

      res.status(200).json({ data: findFriendsData, message: `findFriends by userid ${userId}` });
    } catch (error) {
      next(error);
    }
  };

  public createFriend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const friendData: FriendDto = req.body;
      const createFriendData: Friends = await this.friendsService.createFriend(friendData);

      res.status(201).json({ data: createFriendData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteFriend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const friendData: FriendDto = req.body;
      const deleteUserData: User = await this.friendsService.deleteFriend(friendData);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
