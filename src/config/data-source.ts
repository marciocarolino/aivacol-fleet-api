import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserTypeOrmEntity } from '../app/modules/users/persistence/user.typeorm-entity';
import { ModelTypeOrmEntity } from '../app/modules/models/persistence/model.typeorm-entity';
import { VehicleTypeOrmEntity } from '../app/modules/vehicles/persistence/vehicle.typeorm-entity';

const AppDataSource = new DataSource({
  type: 'mssql',

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_DATABASE,

  entities: [UserTypeOrmEntity, ModelTypeOrmEntity, VehicleTypeOrmEntity],

  // migrations: ['src/database/migrations/*.ts'],

  synchronize: false,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

export default AppDataSource;
