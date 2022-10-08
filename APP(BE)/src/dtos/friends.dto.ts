import { IsDataURI, IsDate, IsDecimal, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class FriendDto {
  @IsNumber()
  public followerId: number;

  @IsNumber()
  public followingId: number;
}

export class InputFriendDto {
  @IsNumber()
  public followingId: number;
}
