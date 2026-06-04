import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { UserTypeOrmEntity } from '../app/modules/persistence/user.typeorm-entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mssql',

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_DATABASE,

  entities: [UserTypeOrmEntity],

  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
