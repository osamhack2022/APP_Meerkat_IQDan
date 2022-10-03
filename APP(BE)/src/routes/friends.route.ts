import { Router } from 'express';
import FriendsController from '@controllers/friends.controller';
import { FriendDto, InputFriendDto } from '@dtos/friends.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/friends';
  public router = Router();
  public friendsController = new FriendsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path})`, authMiddleware, this.friendsController.getFriendsById);
    this.router.post(`${this.path}`, validationMiddleware(InputFriendDto, 'body'), authMiddleware, this.friendsController.createFriend);
    this.router.delete(`${this.path}`, validationMiddleware(InputFriendDto, 'body'),authMiddleware,this.friendsController.deleteFriend);
  }
}

export default UsersRoute;
