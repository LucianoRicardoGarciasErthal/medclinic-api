import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private readonly authService = new AuthService();

  async register(req: Request, res: Response): Promise<Response> {
    const user = await this.authService.register(req.body);
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const result = await this.authService.login(req.body);
    return res.status(200).json(result);
  }
}