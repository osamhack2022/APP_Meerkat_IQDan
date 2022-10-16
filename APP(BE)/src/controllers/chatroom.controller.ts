import { NextFunction, Request, Response } from 'express';
import { Chatroom, Friends, User } from '@prisma/client';
import { RequestWithUser } from '@/interfaces/auth.interface';
import FriendsService from '@services/friends.service';
import ChatroomService from '@/services/chatroom.service';
import {
  ChatroomAndNumOfUnreadMessagesDto,
  CreateChatroomDto,
  InviteChatroomDto,
  PutChatroomKeyDto,
  UpdateChatroomDto,
} from '@/dtos/chatroom.dto';
import { ChatroomWithKey } from '../interfaces/chatroom.interface';

class ChatroomController {
  public friendsService = new FriendsService();
  public chatroomService = new ChatroomService();

  // 내가 속해있는 채팅방 정보 모두 가져오기
  public getMyChatrooms = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const chatroomsData: Chatroom[] = await this.chatroomService.getMyChatrooms(userId);
      res.status(200).json({
        data: chatroomsData,
        message: `found all matching chatrooms`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 내가 속해있는 채팅방 정보 + 안읽은 메시지 개수 가져오기
  public getMyChatroomsAndNumOfUnreads = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const chatroomsData: ChatroomAndNumOfUnreadMessagesDto[] =
        await this.chatroomService.getMyChatroomsAndNumOfUnreads(userId);
      res.status(200).json({
        data: chatroomsData,
        message: `found all matching chatrooms and unread messages number`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 특정 채팅방 정보 가져오기
  public getChatroom = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const chatroomId = Number(req.params.id);
      const chatroomData: ChatroomWithKey = await this.chatroomService.getChatroom(
        userId,
        chatroomId,
      );
      res.status(200).json({
        data: chatroomData,
        message: `found the matching chatroom`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 특정 채팅방에 속한 모든 유저정보 불러오기
  public getAllUsersInChat = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const chatroomId = Number(req.params.id);
      const usersInChat = await this.chatroomService.getAllUsersInChat(userId, chatroomId);

      res.status(200).json({
        data: usersInChat,
        message: `success`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 해당 유저 모든 친구 불러오기
  public getAllFriends = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const friendsData: User[] = await this.friendsService.findFriendsById(userId);
      res.status(200).json({
        data: friendsData,
        message: `found all friends for the user`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 채팅방 개설
  public createChat = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { name, targetUserIds, msgExpTime, commanderUserIds, removeAfterRead, removeType } =
        req.body as CreateChatroomDto;

      if (targetUserIds.length === 1) {
        let chatroomInfo = await this.chatroomService.create1to1Chat(
          userId,
          targetUserIds[0],
          name,
          msgExpTime,
          removeAfterRead,
          removeType
        );

        res.status(200).json({ data: chatroomInfo, message: `success` });
      } else {
        let chatroomInfo = await this.chatroomService.createMultiChat(
          userId,
          targetUserIds,
          name,
          msgExpTime,
          commanderUserIds,
          removeAfterRead,
          removeType
        );

        res.status(200).json({ data: chatroomInfo, message: `success` });
      }
    } catch (error) {
      next(error);
    }
  };

  // 채팅방 초대
  public inviteToChat = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { chatroomId, targetUserIds } = req.body as InviteChatroomDto;
      await this.chatroomService.inviteToChat(userId, chatroomId, targetUserIds);
      res.status(200).json({
        message: `success`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 채팅방 떠나기
  public leaveChat = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { chatroomId } = req.body;
      await this.chatroomService.leaveChat(userId, chatroomId);
      res.status(200).json({
        message: `success`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 채팅방 정보 변경
  public updateChat = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { chatroomId, name, msgExpTime, removeAfterRead } = req.body as UpdateChatroomDto;
      await this.chatroomService.UpdateChatroom(
        userId,
        chatroomId,
        name,
        msgExpTime,
        removeAfterRead,
      );
      res.status(200).json({
        message: `success`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 다른 유저들을 채팅방에 초대할 때 프런트에서 생성한 채팅방 키 업로드
  public putChatroomKey = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { forChatroomId, forUserId, encryptedKey } = req.body as PutChatroomKeyDto;

      await this.chatroomService.putChatroomKey(forUserId, forChatroomId, encryptedKey);

      res.status(200).json({
        message: `success`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 채팅방 키 가져오기
  public getChatroomKey = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const chatroomId = Number(req.params.id);
      const encryptedKey = await this.chatroomService.getChatroomKey(userId, chatroomId);

      res.status(200).json({
        data: {
          encryptedKey: encryptedKey,
        },
        message: `success`,
      });
    } catch (error) {
      next(error);
    }
  };

  // 방 최상급자 id 가져오기
  public getCommander = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const chatroomId = Number(req.params.id);
      const commId = await this.chatroomService.getCommander(chatroomId);

      res.status(200).json({
        data: {
          userId: commId,
        },
        message: `success`,
      });
    } catch (error) {
      next(error);
    }
  };



  // 채팅방 삭제
    public removeChat = async (
      req: RequestWithUser,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const userId = req.user.userId;
        const chatroomId = Number(req.params.id);
        await this.chatroomService.removeChat(userId, chatroomId);
  
        res.status(200).json({
          message: `success`,
        });
      } catch (error) {
        next(error);
      }
    };

}

export default ChatroomController;

