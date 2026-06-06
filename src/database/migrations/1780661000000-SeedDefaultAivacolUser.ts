import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultAivacolUser1780661000000 implements MigrationInterface {
  name = 'SeedDefaultAivacolUser1780661000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      IF NOT EXISTS (SELECT 1 FROM "users" WHERE "email" = 'aivacol@email.com')
      BEGIN
        INSERT INTO "users" ("id", "nickname", "name", "email", "password", "created_by")
        VALUES (
          '11111111-1111-4111-8111-111111111111',
          'aivacol',
          'Aivacol',
          'aivacol@email.com',
          '$2b$10$Xy6KgYRdmQjBMWkp7bECgOQIH0xNbuGZja8gAAtgp5RTZ7RYo2ZBu',
          'seed'
        )
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "users" WHERE "email" = 'aivacol@email.com'`,
    );
  }
}
