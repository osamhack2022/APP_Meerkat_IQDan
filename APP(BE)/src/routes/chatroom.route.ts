import { Router } from 'express';
import ChatroomController from '@/controllers/chatroom.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateChatroomDto, GetChatroomUsersInfoDto, InviteChatroomDto, UpdateChatroomDto} from '@/dtos/chatroom.dto';
import { PutChatroomKeyDto } from '../dtos/chatroom.dto';

class ChatroomRoute implements Routes {
  public path = '/chatroom';
  public router = Router();
  public chatroomController = new ChatroomController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 해당 유저의 모든 채팅방 정보 가져오기
    this.router.get(
      `${this.path}/my`,
      authMiddleware,
      this.chatroomController.getMyChatrooms
      )
    // 한 개의 채팅방 정보 가져오기
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.chatroomController.getChatroom
    );
    this.router.get(
      `${this.path}/getAllUsersInfo/:id(\\d+)`,
      authMiddleware,
      this.chatroomController.getAllUsersInChat
    )
    // 채팅방에 새로운 유저 추가하기
    this.router.post(
      `${this.path}/invite`,
      validationMiddleware(InviteChatroomDto, 'body'),
      authMiddleware,
      this.chatroomController.inviteToChat
    )
    // 모든 친구 호출
    this.router.get(
      `${this.path}/getAllFriends`,
      authMiddleware,
      this.chatroomController.getAllFriends,
    );
    // 채팅방 개설
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(CreateChatroomDto, 'body'),
      authMiddleware,
      this.chatroomController.createChat,
    );
    // 채팅방 수정
    this.router.put(
      `${this.path}/modify`,
      validationMiddleware(UpdateChatroomDto, 'body'),
      authMiddleware,
      this.chatroomController.updateChat
    );
    // 암호화 된 챗룸키 서버에 남기기
    this.router.post(
      `${this.path}/chatroomKey`,
      validationMiddleware(PutChatroomKeyDto, 'body'),
      authMiddleware,
      this.chatroomController.putChatroomKey
    )
  }
}

export default ChatroomRoute;
