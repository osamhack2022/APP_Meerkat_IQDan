import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
    this.router.get(`${this.path}/logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
