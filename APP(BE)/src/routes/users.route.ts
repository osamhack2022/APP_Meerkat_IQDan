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
    // 모든 사용자 정보 목록 가져오기
    this.router.get(`${this.path}`, this.usersController.getUsers);
    // id에 해당하는 사용자 정보 가져오기
    this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    // 나의 정보 가져오기
    this.router.get(`${this.path}/me`, authMiddleware, this.usersController.getUserMe);
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateUserDto, 'body'),
      this.usersController.createUser,
    );
    // 친구 추가하기
    this.router.post(
      `${this.path}/friends`,
      validationMiddleware(SearchUserDto, 'body'),
      this.usersController.getUserForFriend,
    );
    // 내 프로필 갱신하기
    this.router.put(
      `${this.path}/updateUserInfo`,
      validationMiddleware(UpdateUserDto, 'body', true),
      authMiddleware,
      this.usersController.updateUserInfo,
    );
    // 내 프로필 사진 갱신하기
    this.router.put(
      `${this.path}/updateProfilePic`,
      validationMiddleware(UpdateUserDto, 'body', true),
      authMiddleware,
      this.usersController.updateProfilePic,
    );
    // 내 비밀번호 갱신하기
    this.router.put(
      `${this.path}/updateUserPw`,
      validationMiddleware(UpdatePasswordDto, 'body', true),
      authMiddleware,
      this.usersController.updateUserPw,
    );
    // 퍼블릭 키 가져오기
    this.router.get(
      `${this.path}/publicKey/:id(\\d+)`,
      authMiddleware,
      this.usersController.getPublicKey,
    );
    // 퍼블릭 키 업데이트
    this.router.post(
      `${this.path}/publicKey`,
      validationMiddleware(updatePublicKeyDto, 'body'),
      authMiddleware,
      this.usersController.updatePublicKey,
    );
    // 사용자 삭제하기
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      this.usersController.deleteUser,
    );
  }
}

export default UsersRoute;
