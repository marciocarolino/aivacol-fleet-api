import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './app/modules/users/users.module';
import AppDataSource from './config/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot(AppDataSource.options),

    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
