import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import { UserResponseDTO } from '../dtos/UserResponseDTO';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { User, UserRole } from '../entities/User';

export class AuthService {
  private readonly userRepo = new UserRepository();

  async register(data: CreateUserDTO): Promise<UserResponseDTO> {
    const { nome, email, senha, role } = data;

    if (!nome || !email || !senha) {
      throw new AppError('Nome, email e senha sao obrigatorios', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Formato de email invalido', 400);
    }

    if (senha.length < 6) {
      throw new AppError('Senha deve ter no minimo 6 caracteres', 400);
    }

    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new AppError('Email ja cadastrado', 409);
    }

    const hashed = await hashPassword(senha);
    const user = await this.userRepo.create({
      nome,
      email,
      senha: hashed,
      role: role ?? UserRole.ATENDENTE,
    });

    return this.toResponse(user);
  }

  async login(data: LoginDTO): Promise<{ token: string; user: UserResponseDTO }> {
    const { email, senha } = data;

    if (!email || !senha) {
      throw new AppError('Email e senha sao obrigatorios', 400);
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciais invalidas', 401);
    }

    const match = await comparePassword(senha, user.senha);
    if (!match) {
      throw new AppError('Credenciais invalidas', 401);
    }

    const token = generateToken({ sub: user.id, role: user.role });
    return { token, user: this.toResponse(user) };
  }

  private toResponse(user: User): UserResponseDTO {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
