import { UserRole } from '../entities/User';

export interface UserResponseDTO {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
