import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

/**
 * 오류 발생 시 해당 error를 리턴합니다.
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const customCode: string = error.customCode || '';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    if (customCode === '') {
      res.status(status).json({ message })
    } else {
      res.status(status).json({ message, customCode })
    }
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
