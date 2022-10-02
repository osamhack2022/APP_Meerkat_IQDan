import { Router } from 'express';
import FriendsController from '@controllers/friends.controller';
import { FriendDto } from '@dtos/friends.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class UsersRoute implements Routes {
  public path = '/friends';
  public router = Router();
  public friendsController = new FriendsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id(\\d+)`, this.friendsController.getFriendsById);
    this.router.post(`${this.path}`, validationMiddleware(FriendDto, 'body'), this.friendsController.createFriend);
    this.router.delete(`${this.path}`, this.friendsController.deleteFriend);
  }
}

export default UsersRoute;
