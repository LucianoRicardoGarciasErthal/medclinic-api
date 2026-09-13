import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UserRole } from '../entities/User';

export const adminRouter = Router();
const controller = new AdminController();

adminRouter.get(
  '/ping',
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  (req, res) => controller.ping(req, res),
);