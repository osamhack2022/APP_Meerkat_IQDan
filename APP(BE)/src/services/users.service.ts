import { hash } from 'bcrypt';
import { PublicKey, User } from '@prisma/client';
import { CreateUserDto, SearchUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import prisma from "../db";

class UserService {
  /**
   * userId에 해당하는 사용자가 존재 유무를 확인합니다.
   * @param userId 
   * @throw HttpException "409, User doesn't exist"
   * @returns userId에 해당하는 사용자 정보
   */
  public async checkUserExists(userId: number): Promise<User> {
    const findUser: User = await prisma.user.findUnique({
      where: { userId: userId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    return findUser;
  }

  /**
   * @returns 모든 사용자 정보 리스트
   */
  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await prisma.user.findMany();
    return allUser;
  }

  /**
   * @param userId 
   * @throw HttpException "400, UserId is empty"
   * @returns userId에 해당하는 사용자 정보
   */
  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');
    return await this.checkUserExists(userId);
  }

  /**
   * parameter로 주어진 사용자의 친구 목록을 리턴합니다.
   * @param userInfo 
   * @throw HttpException "400, userInfo is empty"
   * @throw HttpException "409, User doesn't exist"
   * @throw HttpException "409, User name is not match"
   * @returns parameter로 주어진 사용자의 친구 사용자 정보 리스트
   */
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

  /**
   * parameter에 해당하는 사용자 정보로 사용자를 생성 후 리턴합니다.
   * @param userData 
   * @throw HttpException "400, userData is empty"
   * @throw HttpException "409, This uid [uid] already exists"
   * @throw HttpException "409, This serviceNumber [serviceNumber] already exists"
   * @returns 생성된 사용자 정보
   */
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

  /**
   * parameter로 주어진 사용자 프로필을 변경합니다.
   * @param userId 
   * @param userData 
   * @throw HttpException "400, userInfo is empty"
   * @returns 업데이트된 사용자 정보
   */
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

  /**
   * parameter로 주어진 사용자 프로필 사진을 변경합니다.
   * @param userId 
   * @param image 
   * @returns 업데이트된 사용자 정보
   */
  public async updateProfilePic(userId: number, image: string): Promise<User> {
    await this.checkUserExists(userId);
    const updateUserData = await prisma.user.update({
      where: { userId: userId },
      data: { image: image },
    });

    return updateUserData;
  }
 
  /**
   * parameter로 주어진 사용자 비밀번호를 변경합니다.
   * @param userId 
   * @param password 
   * @returns 업데이트된 사용자 정보
   */
  public async updateUserPw(userId: number, password: string): Promise<User> {
    await this.checkUserExists(userId);
    const hashedPassword = await hash(password, 10);
    const updateUserData = await prisma.user.update({
      where: { userId: userId },
      data: { password: hashedPassword },
    });

    return updateUserData;
  }

  /**
   * userId에 해당하는 사용자를 삭제합니다.
   * @param userId 
   * @throw HttpException "400, User doesn't existId"
   * @throw HttpException "409, User doesn't exist"
   */
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

  /**
   * @param userId 
   * @returns userId에 해당하는 사용자의 공개키
   */
  public async getPublicKey(userId: number): Promise<PublicKey> {
    await this.checkUserExists(userId);

    const res = await prisma.publicKey.findUnique({
      where: { userId: userId },
    });

    return res;
  }

  /**
   * userId에 해당하는 사용자의 공개키를 업데이트합니다.
   * @param userId 
   * @param publicKey 
   * @returns 업데이트된 사용자 정보
   */
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
