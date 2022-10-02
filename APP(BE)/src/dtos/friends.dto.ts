import { IsDataURI, IsDate, IsDecimal, IsEmail, IsOptional, IsString } from 'class-validator';

export class FriendDto {
  @IsString()
  public followerId: number;

  @IsString()
  public followingId: number;
}
