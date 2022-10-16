import { AllClear, AllClearResponse, AllClearResponseType, Message } from "@prisma/client";
import ValidateSerivce from "./validate.service";
import prisma from "../db"
import { isEmpty } from "class-validator";

export default class AllClearSerivce{
    private validateSerivce = new ValidateSerivce();

    /**
     * @returns messageId에 해당하는 AllClear 응답 전체
     */
    public async findAllClearResponsesByMessageId(userId : number, messageId: number): Promise<AllClearResponse[]>{
        // validation part
        const message: Message = await this.validateSerivce.checkMessageExists(messageId);
        await this.validateSerivce.checkUserExists(userId);
        await this.validateSerivce.checkChatroomExists(message.belongChatroomId);
        await this.validateSerivce.checkUserInChatroom(userId, message.belongChatroomId);

        // get all allclear responses
        return await prisma.allClearResponse.findMany({
            where:{
                allClear:{
                    messageId: messageId
                }
            }
        });
    }
    
    /**
     * @returns messageId에 해당하는 AllClear 생성 및 리턴
     */
    public async createAllClear(userId: number, messageId: number): Promise<AllClear>{
        // validation part
        const message: Message = await this.validateSerivce.checkMessageExists(messageId);
        await this.validateSerivce.checkUserExists(userId);
        await this.validateSerivce.checkChatroomExists(message.belongChatroomId);
        await this.validateSerivce.checkUserInChatroom(userId, message.belongChatroomId);

        return await prisma.allClear.create({
            data:{
                messageId: messageId
            }
        });
    }

    /**
     * @returns 입력에 해당하는 AllClearResponse를 리턴.
     */
    public async findAllClearResponse(userId: number, messageId: number): Promise<AllClearResponse>{
        // validation part
        const message: Message = await this.validateSerivce.checkMessageExists(messageId);
        await this.validateSerivce.checkUserExists(userId);
        await this.validateSerivce.checkChatroomExists(message.belongChatroomId);
        await this.validateSerivce.checkUserInChatroom(userId, message.belongChatroomId);
        const allClear = await this.validateSerivce.checkAllClearExists(messageId);

        return await prisma.allClearResponse.findUnique({
            where:{
                userId_allClearId:{
                    userId: userId,
                    allClearId: allClear.allClearId
                }
            }
        });
    }

    /**
     * messageId에 해당하는 AllClear에 userId가 응답.
     * @returns 기존에 AllClearResponse가 있으면 갱신, 없으면 생성 후 리턴.
     */
    public async createAllClearResponse(userId: number, messageId: number, type: AllClearResponseType, content: string): Promise<AllClearResponse>{
        // validation part
        const message: Message = await this.validateSerivce.checkMessageExists(messageId);
        await this.validateSerivce.checkUserExists(userId);
        await this.validateSerivce.checkChatroomExists(message.belongChatroomId);
        await this.validateSerivce.checkUserInChatroom(userId, message.belongChatroomId);
        const allClear = await this.validateSerivce.checkAllClearExists(messageId);

        // 기존에 있으면 갱신, 없으면 생성
        return await prisma.allClearResponse.upsert({
            where: {
                userId_allClearId: {
                    userId: userId,
                    allClearId: allClear.allClearId
                }
            },
            update: {
                type: type,
                content: content
            },
            create: {
                type: type,
                content: content,
                userId: userId,
                allClearId: allClear.allClearId
            }
        });
    }
}