import { compare, hash } from 'bcrypt';
import { sign,verify } from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { SECRET_KEY } from '@config';

import { LoginUserDto } from '@dtos/users.dto';

import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';
import prisma from "../db"

class AuthService {

  public async login(userData: LoginUserDto): Promise<{ tokenData: TokenData; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await prisma.user.findUnique({ where: { uid: userData.uid } });

    if (!findUser) throw new HttpException(409, `This id ${userData.uid} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    const tokenData = this.createToken(findUser);

    return { tokenData, findUser };
  }


  public createToken(user: User): TokenData {

    const dataStoredInToken: DataStoredInToken = { id: user.userId, name:user.name, serviceNumber:user.serviceNumber };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60 * 5;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public getAuthorizationAtCookie(cookie:string):string{
    const auth=cookie.split('Authorization=')[1];
    return auth;
  }

  public decodeToken(token:string):any{
    try {
      const decoded = verify(token, SECRET_KEY);
      return decoded;

    } catch(err) {
      console.log(err);
      throw new HttpException(403, `decode token is fail`);
    }
  }
}

export default AuthService;
