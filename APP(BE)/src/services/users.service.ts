import { hash } from 'bcrypt';
import { PrismaClient, PublicKey, User } from '@prisma/client';
import { CreateUserDto, SearchUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import prisma from "../db";

class UserService {

  // 유저 존재 유뮤 확인
  public async checkUserExists(userId: number): Promise<User> {
    const findUser: User = await prisma.user.findUnique({
      where: { userId: userId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    return findUser;
  }

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await prisma.user.findMany();
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');
    return await this.checkUserExists(userId);
  }

  public async findUserByFriend(userInfo: SearchUserDto): Promise<User> {
    if (isEmpty(userInfo)) throw new HttpException(400, 'userInfo is empty');

    const findUser: User = await prisma.user.findUnique({
      where: { serviceNumber: userInfo.serviceNumber },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (findUser.name !== userInfo.name) throw new HttpException(409, 'User name is not match');
    delete findUser.password;
    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUserById: User = await prisma.user.findUnique({
      where: { uid: userData.uid },
    });
    if (findUserById)
      throw new HttpException(409, `This uid ${userData.uid} already exists`, 'errCode1');

    const findUserByServiceNumber: User = await prisma.user.findUnique({
      where: { serviceNumber: userData.serviceNumber },
    });
    if (findUserByServiceNumber)
      throw new HttpException(
        409,
        `This serviceNumber ${userData.serviceNumber} already exists`,
        'errCode2',
      );

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });
    return createUserData;
  }

  // 나의 프로필 변경
  public async updateUserInfo(
    userId: number,
    userData: {
      enlistmentDate: Date;
      affiliatedUnit: string;
      militaryRank: string;
    },
  ): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    await this.checkUserExists(userId);

    const updateUserData = await prisma.user.update({
      where: { userId: userId },
      data: { ...userData },
    });

    return updateUserData;
  }

  // 프로필 사진 변경
  public async updateProfilePic(userId: number, image: string): Promise<User> {
    await this.checkUserExists(userId);
    const updateUserData = await prisma.user.update({
      where: { userId: userId },
      data: { image: image },
    });

    return updateUserData;
  }

  // 비밀번호 변경
  public async updateUserPw(userId: number, password: string): Promise<User> {
    await this.checkUserExists(userId);
    const hashedPassword = await hash(password, 10);
    const updateUserData = await prisma.user.update({
      where: { userId: userId },
      data: { password: hashedPassword },
    });

    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "User doesn't existId");

    const findUser: User = await prisma.user.findUnique({
      where: { userId: userId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await prisma.user.delete({
      where: { userId: userId },
    });
    return deleteUserData;
  }

  // 퍼블릭키 가져오기
  public async getPublicKey(userId: number): Promise<PublicKey> {
    await this.checkUserExists(userId);

    const res = await prisma.publicKey.findUnique({
      where: { userId: userId },
    });

    return res;
  }

  // 퍼블릭키 변경
  public async updatePublicKey(userId: number, publicKey: string): Promise<PublicKey> {
    await this.checkUserExists(userId);

    const updateUserData = await prisma.publicKey.upsert({
      where: { userId: userId },
      create: { userId: userId, publicKey: publicKey },
      update: { publicKey: publicKey },
    });

    return updateUserData;
  }
}

export default UserService;
