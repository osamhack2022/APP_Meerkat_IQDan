import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, SearchUserDto, UpdateUserDto, UpdatePasswordDto, updatePublicKeyDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import MessagesController from '@/controllers/message.controller';

class MessagesRoute implements Routes {
  public path = '/messages';
  public router = Router();
  public messagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/unread`, authMiddleware, this.messagesController.getUnreadMessages);
  }
}

export default MessagesRoute;
