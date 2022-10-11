import { NextFunction, Response } from 'express';
import { Message } from '@prisma/client';
import { RequestWithUser } from '@/interfaces/auth.interface';
import MessageService from '@/services/message.service';
import { FindMessageDto } from '@/dtos/messages.dto';

class MessagesController {
  public messagesService = new MessageService();

  public getUnreadMessages = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findMessagDto: FindMessageDto = {
        chatroomId: req.body.chatroomId,
        userId: req.user.userId
      };
      const unreadMessage: Message[] = await this.messagesService.getUnreadChats(findMessagDto);
      res.status(200).json({
        data: unreadMessage,
        message: `get unread messages`
      })
    }
    catch (error) {
      next(error);
    }
  }
}

export default MessagesController;
