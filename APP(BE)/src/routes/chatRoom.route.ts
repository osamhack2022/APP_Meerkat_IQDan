import { Router } from 'express';
import ChatRoomController from '@/controllers/chatRoom.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class ChatRoomRoute implements Routes {
  public path = '/chatRoom';
  public router = Router();
  public chatRoomController = new ChatRoomController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 모든 친구 호출
    this.router.get(`${this.path}/getAllFriends`, authMiddleware, this.chatRoomController.getAllFriends);
    
  }
}

export default ChatRoomRoute;
