import { Router } from 'express';
import ChatroomController from '@/controllers/chatroom.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateChatroomDto} from '@/dtos/chatroom.dto';

class ChatroomRoute implements Routes {
  public path = '/chatroom';
  public router = Router();
  public chatroomController = new ChatroomController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 채팅방 정보 가져오기
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.chatroomController.getChatroom
    );
    // 모든 친구 호출
    this.router.get(
      `${this.path}/getAllFriends`,
      authMiddleware,
      this.chatroomController.getAllFriends,
    );
    // 채팅방 개설
    this.router.post(
      `${this.path}/createChat`,
      validationMiddleware(CreateChatroomDto, 'body'),
      authMiddleware,
      this.chatroomController.createChat,
    );
  }
}

export default ChatroomRoute;
