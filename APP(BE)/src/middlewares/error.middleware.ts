import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

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
