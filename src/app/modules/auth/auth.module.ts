import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';

import { JwtTokenService } from './services/jwt-token.service';
import { AuthController } from '../../presentation/auth/controllers/auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const tokenServiceProvider = {
  provide: 'TokenService',
  useExisting: JwtTokenService,
};

@Module({
  imports: [
    UsersModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ??
          '1d') as JwtSignOptions['expiresIn'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtTokenService,
    JwtStrategy,
    LoginUseCase,
    JwtAuthGuard,
    tokenServiceProvider,
  ],
  exports: [tokenServiceProvider, LoginUseCase],
})
export class AuthModule {}
