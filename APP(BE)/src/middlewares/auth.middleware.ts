import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import prisma from "../db"
import { isEmpty } from 'class-validator';

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

export const validateSocketToken = async (auth, next) => {
  if (!(isEmpty(auth) || isEmpty(auth.token))) {
    const secretKey: string = SECRET_KEY;
    const verificationResponse = (await verify(auth.token, secretKey)) as DataStoredInToken;
    const userId = verificationResponse.id;
    const findUser = await prisma.user.findUnique({ where: { userId: Number(userId) } });

    if (findUser) {
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
