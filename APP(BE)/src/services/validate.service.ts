import prisma from '../db';
import { isEmpty } from "class-validator";
import { HttpException } from '@/exceptions/HttpException';
import { AllClear, Chatroom, Message, User, UsersOnChatrooms } from '@prisma/client';

export default class ValidateSerivce{
    /**
   * throw error when user does not exist.
   * @throws HttpException 404 "User does not exist."
   */
  public async checkUserExists(userId: number): Promise<User> {
    const user = await prisma.user.findUnique({ where: { userId: userId } });
    if (isEmpty(user)) throw new HttpException(400, 'User does not exist');
    return user;
  }

  /**
  * throw error when chatroom does not exist.
  * @throws HttpException 404 "Chatroom does not exist."
  */
   public async checkChatroomExists(chatroomId: number): Promise<Chatroom> {
    const chatroom = await prisma.chatroom.findUnique({ where: { chatroomId: chatroomId } });
    if (isEmpty(chatroom)) throw new HttpException(404, 'Chatroom does not exist.');
    return chatroom;
  }

  /**
   * throw error when user does not exist in chatroom
   * @throws HttpExcpeion 400 "You are not a member of this chat room."
   */
   public async checkUserInChatroom(userId: number, chatroomId: number): Promise<UsersOnChatrooms> {
    const usersOnChatrooms = await prisma.usersOnChatrooms.findUnique({
      where: {
        chatroomId_userId: {
          userId: userId,
          chatroomId: chatroomId,
        },
      }
    })
    if (isEmpty(usersOnChatrooms)) throw new HttpException(403, 'You are not a member of this chat room.');
    return usersOnChatrooms;
  }

  /**
   * throw error when message does not exists
   * @throw HttpException "404, Message does not exist"
   */
   public async checkMessageExists(messageId: number): Promise<Message>{
    const message = await prisma.message.findUnique({ where: { messageId: messageId } });
    if (isEmpty(message)) throw new HttpException(404, 'Message does not exist.');
    return message;
  }

  /**
   * throw error when allclear does not exists
   * @throw HttpException "404, All clear does not exist"
   */
  public async checkAllClearExists(messageId: number): Promise<AllClear>{
    const allClear = await prisma.allClear.findUnique({ where: { messageId: messageId } });
    if(isEmpty(allClear)) throw new HttpException(404, 'All clear does not exist.');
    return allClear;
  }

  /**
   * throw error when allclear exists
   * @throw HttpException "409, All clear already exist."
   */
   public async checkAllClearAlreadyExists(messageId: number): Promise<AllClear>{
    const allClear = await prisma.allClear.findUnique({ where: { messageId: messageId } });
    if(!isEmpty(allClear)) throw new HttpException(409, 'All clear already exist.');
    return allClear;
  }
}