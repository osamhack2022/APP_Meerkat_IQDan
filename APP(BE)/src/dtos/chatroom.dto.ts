import { IsDataURI, IsDate, IsDecimal, IsEmail, IsOptional, IsString, isArray, IsArray, IsNumber, IsBoolean } from 'class-validator';

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