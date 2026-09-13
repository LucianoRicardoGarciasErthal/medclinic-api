import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';
import { UserResponseDTO } from '../dtos/UserResponseDTO';

export class UserService {
  private readonly userRepo = new UserRepository();

  async getById(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError('Usuario nao encontrado', 404);
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
