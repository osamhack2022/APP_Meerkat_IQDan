import AllClearController from "@/controllers/allclear.controller";
import { Routes } from "@/interfaces/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateAllClearDto, CreateAllClearResponseDto } from "@/dtos/allclear.dto";
import { Router } from "express";

class AllClearRoutes implements Routes {
  public path = '/allclear';
  public router = Router();
  public allClearController = new AllClearController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 이상무 개설
    this.router.post(`${this.path}/create`, validationMiddleware(CreateAllClearDto), authMiddleware, this.allClearController.createAllClear);
    // 이상무 응답 전체 가져오기
    this.router.get(`${this.path}/response/all/:id(\\d+)`, authMiddleware, this.allClearController.getAllClearResponses);
    // 특정 이상무 응답 1개 가져오기
    this.router.get(`${this.path}/response/:id(\\d+)`, authMiddleware, this.allClearController.getAllClearResponse);
    // 특정 이상무 응답이 있으면 update, 없으면 create
    this.router.put(`${this.path}/response/create`, validationMiddleware(CreateAllClearResponseDto), authMiddleware, this.allClearController.upsertAllClearResponse);
  }
}

export default AllClearRoutes;
