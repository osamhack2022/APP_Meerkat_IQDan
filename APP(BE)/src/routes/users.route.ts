import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, SearchUserDto, UpdateUserDto, UpdatePasswordDto, updatePublicKeyDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    this.router.get(`${this.path}/me`, authMiddleware, this.usersController.getUserMe);
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateUserDto, 'body'),
      this.usersController.createUser,
    );
    this.router.post(
      `${this.path}/friends`,
      validationMiddleware(SearchUserDto, 'body'),
      this.usersController.getUserForFriend,
    );
    this.router.put(
      `${this.path}/updateUserInfo`,
      validationMiddleware(UpdateUserDto, 'body', true),
      authMiddleware,
      this.usersController.updateUserInfo,
    );
    this.router.put(
      `${this.path}/updateProfilePic`,
      validationMiddleware(UpdateUserDto, 'body', true),
      authMiddleware,
      this.usersController.updateProfilePic,
    );
    this.router.put(
      `${this.path}/updateUserPw`,
      validationMiddleware(UpdatePasswordDto, 'body', true),
      authMiddleware,
      this.usersController.updateUserPw,
    );
    // 퍼블릭 키 업데이트
    this.router.put(
      `${this.path}/updatePublicKey`,
      validationMiddleware(updatePublicKeyDto, 'body'),
      authMiddleware,
      this.usersController.updatePublicKey,
    );
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      this.usersController.deleteUser,
    );
  }
}

export default UsersRoute;
