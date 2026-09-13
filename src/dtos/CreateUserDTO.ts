import { UserRole } from '../entities/User';

export interface CreateUserDTO {
  nome: string;
  email: string;
  senha: string;
  role?: UserRole;
}