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

      const result = [...unreadMessage].map((message)=>{
        return {
        "_id" : message.messageId,
        "text": message.content,
        "sendTime": message.sendTime,
        "deleteTime": message.deleteTime,
        "senderId": message.senderId,
        "belongChatroomId": message.belongChatroomId,
        "isSender": req.user.userId === message.senderId
        }
      });
      

      res.status(200).json({
        data: result,
        message: `get unread messages`
      })
    }
    catch (error) {
      next(error);
    }
  }
}

export default MessagesController;
