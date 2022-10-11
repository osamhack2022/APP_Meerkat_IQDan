import { IsBoolean, IsDataURI, IsDate, IsDecimal, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindMessageDto{
  @IsNumber()
  public chatroomId: number;

  @IsNumber()
  public userId: number;
}
export class IMessageDto {
  @IsNumber()
  public _id : number;

  @IsString()
  public text: string;

  @IsDate()
  public sendTime: Date;

  @IsDate()
  public deleteTime: Date;

  @IsNumber()
  public senderId: number;

  @IsNumber()
  public belongChatroomId: number;

  @IsBoolean()
  public isSender:boolean;
}