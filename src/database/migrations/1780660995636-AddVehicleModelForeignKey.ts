import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVehicleModelForeignKey1780660995636 implements MigrationInterface {
  name = 'AddVehicleModelForeignKey1780660995636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "model_id"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "model_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "FK_c4fe98a2147b08df1ab56df5313" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP CONSTRAINT "FK_c4fe98a2147b08df1ab56df5313"`,
    );
    await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "model_id"`);
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD "model_id" nvarchar(255) NOT NULL`,
    );
  }
}
