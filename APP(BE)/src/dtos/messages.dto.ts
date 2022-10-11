import { IsDataURI, IsDate, IsDecimal, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindMessageDto{
  @IsNumber()
  public chatroomId: number;

  @IsNumber()
  public userId: number;
}

export class MessageDto {
  @IsNumber()
  public messageId: number;

  @IsString()
  public content: string;

  @IsDate()
  public sendTime: Date;

  @IsDate()
  public deleteTime: Date;

  @IsNumber()
  public senderId: number;

  @IsNumber()
  public belongChatroomId: number;
}