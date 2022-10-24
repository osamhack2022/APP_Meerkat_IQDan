import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import MessagesController from '@/controllers/message.controller';
import { GetReadsDto, GetUnreadsDto, SetRecentReadDto } from '@/dtos/messages.dto';

class MessagesRoute implements Routes {
  public path = '/messages';
  public router = Router();
  public messagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // id에 해당하는 채팅방의 읽지 않은 메시지 목록 가져오기
    this.router.get(`${this.path}/unread/:id(\\d+)`, authMiddleware, this.messagesController.getUnreadMessages);
    // 제일 최근에 읽은 messageId 갱신
    this.router.post(`${this.path}/setRecentRead`, validationMiddleware(SetRecentReadDto, 'body'), authMiddleware,  this.messagesController.setRecentRead);
    // 메시지를 읽지 않은 사용자 목록 가져오기
    this.router.post(`${this.path}/unread`, validationMiddleware(GetUnreadsDto, 'body'), authMiddleware, this.messagesController.getUnreadPeoples);
    // 메시지를 읽은 사용자 목록 가져오기
    this.router.post(`${this.path}/read`, validationMiddleware(GetReadsDto, 'body'), authMiddleware, this.messagesController.getReadPeoples);
  }
}

export default MessagesRoute;
