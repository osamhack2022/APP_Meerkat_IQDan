import { ChatRemoveType, ChatroomType } from '@prisma/client';
import { IsDate, IsString, IsArray, IsNumber, IsBoolean, IsEnum } from 'class-validator';

// 채팅방 생성 시 사용하는 DTO
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

// 채팅방 초대 시 사용하는 DTO
export class InviteChatroomDto {
    @IsNumber()
    public chatroomId: number;

    @IsArray()
    public targetUserIds: number[];
}

// 채팅방 정보 갱신 시 사용하는 DTO
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

// 채팅방에 AES 키를 넣을 때 사용하는 DTO
export class PutChatroomKeyDto {
    @IsNumber()
    public forUserId: number;

    @IsNumber()
    public forChatroomId: number;

    @IsString()
    public encryptedKey: string;
}

// 채팅방에 속한 사용자 정보를 가져올 때 사용하는 DTO
export class GetChatroomUsersInfoDto {
    @IsNumber()
    public chatroomId: number;
}

// 채팅방 정보와 읽지 않은 메시지 개수를 가져올 때 사용하는 DTO
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

    @IsDate()
    public lastMessageDate: Date;

    @IsNumber()
    public msgExpTime: number;

    @IsBoolean()
    public removeAfterRead: boolean;

    @IsNumber()
    public numUnreadMessages: number;
}