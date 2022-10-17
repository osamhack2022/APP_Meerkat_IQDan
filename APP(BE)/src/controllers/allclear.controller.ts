import { CreateAllClearDto, CreateAllClearResponseDto, FindAllClearDto } from '@/dtos/allclear.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import AllClearSerivce from '@/services/allclear.service';
import { NextFunction, Response } from 'express';

class AllClearController {
    public allClearSerivce = new AllClearSerivce();

    // 이상무 개설
    public createAllClear = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const createAllClearDto: CreateAllClearDto = req.body;
            const userId = req.user.userId;

            await this.allClearSerivce.createAllClear(userId, createAllClearDto.messageId);
            res.status(201).json({
                message: `success`
            });

        } catch (error) {
            next(error);
        }
    }

    // 이상무 응답 전체 가져오기
    public getAllClearResponses = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const FindAllClearDto: FindAllClearDto = {
                messageId: Number(req.params.id)
            };
            const userId = req.user.userId;

            const allClearResponses = await this.allClearSerivce.findAllClearResponsesByMessageId(userId, FindAllClearDto.messageId);
            res.status(200).json({
                data: allClearResponses,
                message: `get all clear reponses`
            });
        } catch (error) {
            next(error);
        }
    }

    // 특정 이상무 응답 1개 가져오기
    public getAllClearResponse = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const FindAllClearDto: FindAllClearDto = {
                messageId: Number(req.params.id)
            };
            const userId = req.user.userId;

            const allClearResponse = await this.allClearSerivce.findAllClearResponse(userId, FindAllClearDto.messageId);
            res.status(200).json({
                data: allClearResponse,
                message: `get all clear reponses`
            });
        } catch (error) {
            next(error);
        }
    }

    // 특정 이상무 응답이 있으면 update, 없으면 create
    public upsertAllClearResponse = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const createAllClearResponseDto: CreateAllClearResponseDto = req.body;
            const userId = req.user.userId;

            await this.allClearSerivce.createAllClearResponse(userId, createAllClearResponseDto.messageId, createAllClearResponseDto.allClearResponseType, createAllClearResponseDto.content);
            res.status(200).json({
                message: `success`
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AllClearController;
