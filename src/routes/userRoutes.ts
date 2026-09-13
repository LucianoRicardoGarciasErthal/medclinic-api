import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const userRouter = Router();
const controller = new UserController();

userRouter.get('/me', authMiddleware, (req, res) => controller.me(req, res));
