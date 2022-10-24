import { Router } from 'express';
import FriendsController from '@controllers/friends.controller';
import { InputFriendDto } from '@dtos/friends.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class FriendsRouter implements Routes {
  public path = '/friends';
  public router = Router();
  public friendsController = new FriendsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 현 사용자의 친구 목록 가져오기
    this.router.get(`${this.path}`, authMiddleware, this.friendsController.getFriendsById);
    // 친구 생성
    this.router.post(`${this.path}`, validationMiddleware(InputFriendDto, 'body'), authMiddleware, this.friendsController.createFriend);
    // 친구 삭제
    this.router.delete(`${this.path}`, validationMiddleware(InputFriendDto, 'body'), authMiddleware,this.friendsController.deleteFriend);
    
  }
}

export default FriendsRouter;
