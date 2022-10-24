import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

// 메시지를 찾을 때 사용하는 DTO
export class FindMessageDto {
  @IsNumber()
  public chatroomId: number;

  @IsNumber()
  public userId: number;
}

// 사용자가 채팅방에 속해있는지 검색할 때 사용하는 DTO
export class UsersOnChatroomsKeyDto {
  @IsNumber()
  public chatroomId: number;

  @IsNumber()
  public userId: number;
}

// 메시지 DTO
export class IMessageDto {
  @IsNumber()
  public _id: number;

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
  public hasQuickReplies: boolean;
}

// 메시지 읽은 사람 갱신 시 사용하는 DTO
export class SetRecentReadDto {
  @IsNumber()
  public chatroomId: number;

  @IsNumber()
  public recentMessageId: number;
}

// 메시지를 읽지 않은 사람을 가져올 때 사용하는 DTO
export class GetUnreadsDto {
  @IsNumber()
  public chatroomId: number;

  @IsNumber()
  public messageId: number;
}

// 메시지를 읽은 사람을 가져올 때 사용하는 DTO
export class GetReadsDto {
  @IsNumber()
  public chatroomId: number;

  @IsNumber()
  public messageId: number;
}