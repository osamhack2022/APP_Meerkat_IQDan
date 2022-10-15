import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, SearchUserDto, UpdateUserDto, UpdatePasswordDto, updatePublicKeyDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import MessagesController from '@/controllers/message.controller';
import { GetReadsDto, GetUnreadsDto, SetRecentRead } from '@/dtos/messages.dto';

class MessagesRoute implements Routes {
  public path = '/messages';
  public router = Router();
  public messagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/unread/:id(\\d+)`, authMiddleware, this.messagesController.getUnreadMessages);
    this.router.post(`${this.path}/setRecentRead`, validationMiddleware(SetRecentRead, 'body'), authMiddleware,  this.messagesController.setRecentRead);
    this.router.post(`${this.path}/unread`, validationMiddleware(GetUnreadsDto, 'body'), authMiddleware, this.messagesController.getUnreadPeoples);
    this.router.post(`${this.path}/read`, validationMiddleware(GetReadsDto, 'body'), authMiddleware, this.messagesController.getReadPeoples);
  }
}

export default MessagesRoute;
