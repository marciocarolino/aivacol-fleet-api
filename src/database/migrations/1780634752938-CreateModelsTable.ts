import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModelsTable1780634752938 implements MigrationInterface {
  name = 'CreateModelsTable1780634752938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "models" ("created_at" datetime2 NOT NULL CONSTRAINT "DF_2fa3da3e3ed8f1379f8e29ebf49" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_04615a558292d5f284fa7e73bfb" DEFAULT getdate(), "created_by" nvarchar(255) NOT NULL, "id" uniqueidentifier NOT NULL, "name" nvarchar(255) NOT NULL, CONSTRAINT "UQ_3492c71396207453cf17c0928fb" UNIQUE ("name"), CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "models"`);
  }
}
