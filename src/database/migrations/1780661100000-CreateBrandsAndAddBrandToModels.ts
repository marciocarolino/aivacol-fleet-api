import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBrandsAndAddBrandToModels1780661100000 implements MigrationInterface {
  name = 'CreateBrandsAndAddBrandToModels1780661100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "brands" ("created_at" datetime2 NOT NULL CONSTRAINT "DF_9d8b9f4d20a0f82d4ad11c53c01" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_f0c0c9e2a6f97f8be43d7f4e1e2" DEFAULT getdate(), "created_by" nvarchar(255) NOT NULL, "id" uniqueidentifier NOT NULL, "name" nvarchar(255) NOT NULL, CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(`
      INSERT INTO "brands" ("id", "name", "created_by")
      VALUES ('22222222-2222-4222-8222-222222222222', 'Aivacol', 'seed')
    `);

    await queryRunner.query(
      `ALTER TABLE "models" ADD "brand_id" uniqueidentifier NULL`,
    );

    await queryRunner.query(
      `UPDATE "models" SET "brand_id" = '22222222-2222-4222-8222-222222222222' WHERE "brand_id" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "models" ALTER COLUMN "brand_id" uniqueidentifier NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "models" ADD CONSTRAINT "FK_3c8327f6c458693e6f32249d9e3" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "models" DROP CONSTRAINT "FK_3c8327f6c458693e6f32249d9e3"`,
    );
    await queryRunner.query(`ALTER TABLE "models" DROP COLUMN "brand_id"`);
    await queryRunner.query(`DROP TABLE "brands"`);
  }
}
