import { NextFunction, Request, Response } from 'express';
import { LoginUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  // 로그인
  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDto = req.body;
      const { tokenData, findUser } = await this.authService.login(userData);

      res.status(200).json({ data: tokenData, message: 'login'});
    } catch (error) {
      next(error);
    }
  };

  // 로그아웃
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token=this.authService.getAuthorizationAtCookie(req.headers.cookie);
      const logOutUserData=this.authService.decodeToken(token);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;












