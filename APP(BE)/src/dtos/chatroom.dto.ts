import { ChatRemoveType, ChatroomType } from '@prisma/client';
import { IsDataURI, IsDate, IsDecimal, IsEmail, IsOptional, IsString, isArray, IsArray, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export class CreateChatroomDto {
    @IsString()
    public name: string;

    @IsArray()
    public targetUserIds: number[];

    @IsNumber()
    public msgExpTime: number;

    @IsArray()
    public commanderUserIds: number[];

    @IsBoolean()
    public removeAfterRead: boolean;

    @IsString()
    public removeType: ChatRemoveType
}

export class InviteChatroomDto {
    @IsNumber()
    public chatroomId: number;

    @IsArray()
    public targetUserIds: number[];
}

export class UpdateChatroomDto {
    @IsNumber()
    public chatroomId: number;

    @IsString()
    public name: string;

    @IsNumber()
    public msgExpTime: number;

    @IsBoolean()
    public removeAfterRead: boolean;
}

export class PutChatroomKeyDto {
    @IsNumber()
    public forUserId: number;

    @IsNumber()
    public forChatroomId: number;

    @IsString()
    public encryptedKey: string;
}

export class GetChatroomUsersInfoDto {
    @IsNumber()
    public chatroomId: number;
}

export class ChatroomAndNumOfUnreadMessagesDto{
    @IsNumber()
    public chatroomId: number;

    @IsString()
    public name: string;

    @IsEnum(ChatroomType)
    public type: ChatroomType

    @IsDate()
    public createDate: Date;

    @IsDate()
    public updateDate: Date;

    @IsNumber()
    public msgExpTime: number;

    @IsBoolean()
    public removeAfterRead: boolean;

    @IsNumber()
    public numUnreadMessages: number;
}