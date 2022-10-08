import { hash } from 'bcrypt';
import { PrismaClient, User, Friends } from '@prisma/client';
import { FriendDto } from '@dtos/friends.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import prisma from "../../db"
class FriendService {

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
    if (findFriendsForDuplicate)
      throw new HttpException(
        409,
        `This friend follwer-${friendData.followerId} and followind-${friendData.followerId} already exists`,
      );

    const createFriendsData: Friends = await prisma.friends.create({ data: { ...friendData } });
    return createFriendsData;
  }

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
