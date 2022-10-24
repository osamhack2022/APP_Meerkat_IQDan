import { IsNumber } from 'class-validator';

// 사용자의 친구를 검색할 때 사용하는 DTO
export class FriendDto {
  @IsNumber()
  public followerId: number;

  @IsNumber()
  public followingId: number;
}

// 사용자의 친구를 추가할 때 사용하는 DTO
export class InputFriendDto {
  @IsNumber()
  public followingId: number;
}
