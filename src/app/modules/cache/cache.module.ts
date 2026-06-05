import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

import { redisStore } from 'cache-manager-redis-yet';

import { RedisCacheService } from './services/redis-cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        }),

        ttl: Number(process.env.REDIS_TTL ?? 300),
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [NestCacheModule, RedisCacheService],
})
export class CacheModule {}
