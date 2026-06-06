import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintsToVehicleIdentifiers1780661200000 implements MigrationInterface {
  name = 'AddUniqueConstraintsToVehicleIdentifiers1780661200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "UQ_vehicles_chassis" UNIQUE ("chassis")`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" ADD CONSTRAINT "UQ_vehicles_renavam" UNIQUE ("renavam")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP CONSTRAINT "UQ_vehicles_renavam"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicles" DROP CONSTRAINT "UQ_vehicles_chassis"`,
    );
  }
}
