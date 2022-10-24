import { User, Friends } from '@prisma/client';
import { FriendDto } from '@dtos/friends.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import prisma from "../db"
class FriendService {
  /**
   * parameter로 주어진 userId의 모든 friend를 찾습니다.
   * @param userId 
   * @throw HttpException "400, UserId is empty"
   * @throw HttpException "409, User doesn't exist"
   * @returns user의 friend list
   */
  public async findFriendsById(userId: number): Promise<User[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findFriends: { following: User }[] = await prisma.friends.findMany({
      where: { followerId: userId },
      select: {
        following: true,
      },
    });

    const friendsList = findFriends.map(element => {
      delete element.following.password;
      return element.following;
    });

    if (!findFriends) throw new HttpException(409, "User doesn't exist");

    return friendsList;
  }

  /**
   * friendData의 followerId에 해당하는 사용자가 followingId에 해당하는 사용자를 친구추가합니다.
   * @param friendData 
   * @throws HttpException "400, friendData is empty"
   * @throws HttpException "409, This follower id not exists"
   * @throws HttpException "409, This friend follwer-[followerId] and followind-[followerId] already exist"
   * @returns 친구추가 된 사용자 정보
   */
  public async createFriend(friendData: FriendDto): Promise<Friends> {
    if (isEmpty(friendData)) throw new HttpException(400, 'friendData is empty');

    const findUserById: User = await prisma.user.findUnique({
      where: { userId: friendData.followerId },
    });
    if (!findUserById)
      throw new HttpException(409, `This follower id ${friendData.followerId} not exists`);

    const findFriendsForDuplicate: Friends[] = await prisma.friends.findMany({
      where: { followerId: friendData.followerId, followingId: friendData.followingId },
    });

    if (findFriendsForDuplicate.length != 0)
      throw new HttpException(
        409,
        `This friend follwer-${friendData.followerId} and followind-${friendData.followerId} already exists`,
      );

    const createFriendsData: Friends = await prisma.friends.create({ data: { ...friendData } });
    return createFriendsData;
  }

  /**
   * friendData의 follwerId에 해당하는 사용자가 followingId에 해당하는 사용자를 친구삭제합니다.
   * @param friendData 
   * @returns 삭제한 사용자 정보
   */
  public async deleteFriend(friendData: FriendDto): Promise<any> {
    if (isEmpty(friendData)) throw new HttpException(400, "User doesn't existId");

    const findFriends: Friends[] = await prisma.friends.findMany({
      where: { followerId: friendData.followerId, followingId: friendData.followingId },
    });
    if (!findFriends) throw new HttpException(409, "Friends doesn't exist");

    const deleteUserData: any = await prisma.friends.deleteMany({
      where: { followerId: friendData.followerId, followingId: friendData.followingId },
    });
    return deleteUserData;
  }
}

export default FriendService;
