import { IsDataURI, IsDate, IsDecimal, IsEmail, IsOptional, IsString, isArray, IsArray, IsNumber } from 'class-validator';

export class CreateChatroomDto {
    @IsString()
    public name: string;

    @IsArray()
    public targetUserIds: number[];

    @IsNumber()
    public msgExpTime: number;

    @IsArray()
    public commanderUserIds: number[];
}
