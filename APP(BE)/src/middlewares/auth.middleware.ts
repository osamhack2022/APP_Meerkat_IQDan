import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import prisma from "../db"
import { isEmpty } from 'class-validator';

/**
 * req의 cookie나 Authorization header에서 token을 받아와, 올바른지 검증합니다.
 * @param req 
 * @param res 
 * @param next 
 * @throw HttpException "401, Wrong authentication token"
 * @throw HttpException "404, Authentication token missing" when authentication token does not exist
 */
const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse.id;
      
      const findUser = await prisma.user.findUnique({ where: { userId: Number(userId) } });

      if (findUser) {
        req.user = findUser;
        next();
      } else { 
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

/**
 * socket에 있는 token을 검증합니다.
 * @param auth 
 * @param next 
 * @throw Error "Wrong authentication token" when user does not found
 * @throw Error "Authentication token missing" when token does not exist
 */
export const validateSocketToken = async (auth, next) => {
  if (!(isEmpty(auth) || isEmpty(auth.token))) {
    const secretKey: string = SECRET_KEY;
    const verificationResponse = (await verify(auth.token, secretKey)) as DataStoredInToken;
    const userId = verificationResponse.id;
    const findUser = await prisma.user.findUnique({ where: { userId: Number(userId) } });

    if (findUser) {
      auth.userId = userId;
      next();
    } else {
      next(new Error('Wrong authentication token'));
    }
  }
  else {
    next(new Error('Authentication token missing'));
  }
};

export default authMiddleware;
