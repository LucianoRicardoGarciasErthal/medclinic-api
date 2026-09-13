import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AppError } from '../errors/AppError';

export class UserController {
  private readonly userService = new UserService();

  async me(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Usuario nao autenticado', 401);
    }

    const user = await this.userService.getById(req.user.id);
    return res.status(200).json(user);
  }
}
