import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehiclesTable1780660217064 implements MigrationInterface {
    name = 'CreateVehiclesTable1780660217064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicles" ("created_at" datetime2 NOT NULL CONSTRAINT "DF_5f657f45753e2ab552e6cf09c3e" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_894cae7674f3b507d73a585575c" DEFAULT getdate(), "created_by" nvarchar(255) NOT NULL, "id" uniqueidentifier NOT NULL, "license_plate" nvarchar(20) NOT NULL, "chassis" nvarchar(255) NOT NULL, "renavam" nvarchar(255) NOT NULL, "year" int NOT NULL, "model_id" nvarchar(255) NOT NULL, CONSTRAINT "UQ_7e9fab2e8625b63613f67bd706c" UNIQUE ("license_plate"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vehicles"`);
    }

}
