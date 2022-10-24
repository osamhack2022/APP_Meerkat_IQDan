import { compare } from 'bcrypt';
import { sign,verify } from 'jsonwebtoken';
import {  User } from '@prisma/client';
import { SECRET_KEY } from '@config';
import { LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';
import prisma from "../db"

class AuthService {

  /**
   * parameter로 주어진 user를 로그인시킴. ID 존재 검사, PW 검사 이후 토큰을 발급합니다.
   * @param userData 
   * @throws HttpException "400, userData is empty"
   * @throws HttpException "409, This is was not found"
   * @throws HttpException "409, Password is not matching"
   * @returns 해당 사용자의 token과 user 정보
   */
  public async login(userData: LoginUserDto): Promise<{ tokenData: TokenData; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await prisma.user.findUnique({ where: { uid: userData.uid } });

    if (!findUser) throw new HttpException(409, `This id ${userData.uid} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    const tokenData = this.createToken(findUser);

    return { tokenData, findUser };
  }


  /**
   * 해당 사용자의 token 생성 및 리턴합니다.
   * @param user 
   * @returns user token
   */
  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.userId, name:user.name, serviceNumber:user.serviceNumber };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60 * 5;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  /**
   * parameter로 주어진 tokenData를 cookie에 넣어서 string을 리턴합니다.
   * @param tokenData 
   * @returns tokenData가 들어간 cookie
   */
  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  /**
   * cookie에 있는 authorization token을 파싱 후 리턴합니다.
   * @param cookie 
   * @returns cookie에 있는 authorization token
   */
  public getAuthorizationAtCookie(cookie:string):string{
    const auth=cookie.split('Authorization=')[1];
    return auth;
  }

  /**
   * parameter로 주어진 token을 decode 후 리턴합니다.
   * @param token 
   * @throw HttpException "403, decode token is fail" when decode faile
   * @returns decoded token
   */
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
