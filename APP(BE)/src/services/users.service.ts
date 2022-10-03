import { hash } from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto, SearchUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class UserService {
  public users = new PrismaClient().user;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.users.findMany();
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await this.users.findUnique({ where: { userId: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async findUserByFriend(userInfo:SearchUserDto): Promise<User> {
    if (isEmpty(userInfo)) throw new HttpException(400, 'userInfo is empty');

    const findUser: User = await this.users.findUnique({ where: { serviceNumber: userInfo.serviceNumber} });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if(findUser.name!==userInfo.name) throw new HttpException(409, "User name is not match");
    delete findUser.password;
    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUserById: User = await this.users.findUnique({ where: { uid: userData.uid } });
    if (findUserById) throw new HttpException(409, `This uid ${userData.uid} already exists`, 'errCode1');

    const findUserByServiceNumber: User = await this.users.findUnique({ where: { serviceNumber: userData.serviceNumber } });
    if (findUserByServiceNumber) throw new HttpException(409, `This serviceNumber ${userData.serviceNumber} already exists`, 'errCode2');

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ data: { ...userData, password: hashedPassword } });
    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findUnique({ where: { userId: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData = await this.users.update({ where: { userId: userId }, data: { ...userData, password: hashedPassword } });
    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "User doesn't existId");

    const findUser: User = await this.users.findUnique({ where: { userId: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.users.delete({ where: { userId: userId } });
    return deleteUserData;
  }
}

export default UserService;
