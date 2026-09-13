import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  ATENDENTE = 'ATENDENTE',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nome!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ length: 255 })
  senha!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ATENDENTE })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}