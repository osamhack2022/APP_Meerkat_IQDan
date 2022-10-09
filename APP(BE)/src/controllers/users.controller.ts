import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto, SearchUserDto, UpdateUserDto, UpdatePasswordDto } from '@dtos/users.dto';
import userService from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import AuthService from '@services/auth.service';

class UsersController {
  public userService = new userService();
  public authService = new AuthService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getUserMe = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.userId;
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getUserForFriend = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userInfo: SearchUserDto = req.body;
      const findOneUserData: User = await this.userService.findUserByFriend(userInfo);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      await this.userService.createUser(userData);

      res.status(201).json({ message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  // 나의 프로필 변경 (name, serviceNumber, enlistmentDate, affiliatedUnit, militaryRank)
  public updateUserInfo = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { enlistmentDate, affiliatedUnit, militaryRank } = req.body as UpdateUserDto;
      const updateUserData: User = await this.userService.updateUserInfo(userId, {
        enlistmentDate: enlistmentDate,
        affiliatedUnit: affiliatedUnit,
        militaryRank: militaryRank,
      });

      res.status(200).json({ message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  // 프로필 사진 변경 (image)
  public updateProfilePic = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { image } = req.body as UpdateUserDto;
      await this.userService.updateProfilePic(userId, image);

      res.status(200).json({ message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  // 비밀번호 변경 (password)
  public updateUserPw = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const uid = req.user.uid;
      const userId= req.user.userId;
      const { password, currentPassword } = req.body as UpdatePasswordDto;

      await this.authService.login({uid,password:currentPassword});
      await this.userService.updateUserPw(userId, password);

      res.status(200).json({ message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      await this.userService.deleteUser(userId);

      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
