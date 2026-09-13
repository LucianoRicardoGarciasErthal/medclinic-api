import { Request, Response } from 'express';

export class AdminController {
  async ping(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      status: 'ok',
      message: 'pong',
      timestamp: new Date().toISOString(),
    });
  }
}