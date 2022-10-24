import { NextFunction, Response } from 'express';
import { Message, User } from '@prisma/client';
import { RequestWithUser } from '@/interfaces/auth.interface';
import MessageService from '@/services/message.service';
import { FindMessageDto, GetReadsDto, GetUnreadsDto, SetRecentReadDto } from '@/dtos/messages.dto';

class MessagesController {
  public messagesService = new MessageService();

  // 채팅방에서 읽지 않은 모든 메시지 리스트 + 최근에 읽은 메시지 ID 업데이트
  public getUnreadMessages = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const findMessagDto: FindMessageDto = {
        chatroomId: Number(req.params.id),
        userId: req.user.userId,
      };

      // 읽지 않은 모든 메시지
      const unreadMessage: Message[] = await this.messagesService.getUnreadChats(findMessagDto);
      const result = unreadMessage.map(message => {
        return {
          _id: message.messageId,
          text: message.content,
          sendTime: message.sendTime,
          deleteTime: message.deleteTime,
          senderId: message.senderId,
          belongChatroomId: message.belongChatroomId,
          hasQuickReplies: message.hasQuickReply
        };
      });

      // 최근까지 읽은 메세지 업데이트
      if (unreadMessage.length > 0) {
        await this.messagesService.setRecentReadMessage(
          req.user.userId,
          Number(req.params.id),
          unreadMessage[unreadMessage.length - 1].messageId, // 맨 마지막 message의 id
        );
      }

      res.status(200).json({
        data: result,
        message: `get unread messages`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 최근에 읽은 메시지 ID 업데이트 
  public setRecentRead = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { chatroomId, recentMessageId } = req.body as SetRecentReadDto;

      await this.messagesService.setRecentReadMessage(userId, chatroomId, recentMessageId);

      res.status(200).json({
        message: `success`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 메시지를 읽지 않은 사용자 목록
  public getUnreadPeoples = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const getUnreadsDto: GetUnreadsDto = {
        chatroomId: req.body.chatroomId,
        messageId: req.body.messageId
      };

      const unreadPeoples: User[] = await this.messagesService.getUnreadUsers(getUnreadsDto);
      const result = unreadPeoples.map((element) => {
        delete element.password;
        return element;
      });

      res.status(200).json({
        data: result,
        message: `get unread peoples`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 메시지를 읽은 사용자 목록
  public getReadPeoples = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const getReadsDto: GetReadsDto = {
        chatroomId: req.body.chatroomId,
        messageId: req.body.messageId
      };

      const readPeoples: User[] = await this.messagesService.getReadUsers(getReadsDto);
      const result = readPeoples.map((element) => {
        delete element.password;
        return element;
      });

      res.status(200).json({
        data: result,
        message: `get read peoples`,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MessagesController;
