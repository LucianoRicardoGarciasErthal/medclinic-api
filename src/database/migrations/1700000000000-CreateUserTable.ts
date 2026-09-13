import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'nome', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '150', isUnique: true },
          { name: 'senha', type: 'varchar', length: '255' },
          {
            name: 'role',
            type: 'enum',
            enum: ['ADMIN', 'ATENDENTE'],
            default: `'ATENDENTE'`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}