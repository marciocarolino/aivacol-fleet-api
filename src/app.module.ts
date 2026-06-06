import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';

import { JwtAuthGuard } from './app/modules/auth/guards/jwt-auth.guard';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './app/modules/users/users.module';
import AppDataSource from './config/data-source';
import { AuthModule } from './app/modules/auth/auth.module';
import { ModelsModule } from './app/modules/models/models.module';
import { VehiclesModule } from './app/modules/vehicles/vehicles.module';
import { CacheModule } from './app/modules/cache/cache.module';
import { BrandsModule } from './app/modules/brands/brands.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
    ]),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    CacheModule,

    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      migrations: [],
    }),

    AuthModule,

    UsersModule,
    BrandsModule,
    ModelsModule,
    VehiclesModule,
  ],
  controllers: [],
  providers: [
    // Apply JWT authentication globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
