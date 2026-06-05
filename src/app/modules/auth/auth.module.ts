import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';

import { JwtTokenService } from './services/jwt-token.service';
import { AuthController } from '../../presentation/auth/controllers/auth.controller';

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
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtTokenService, LoginUseCase, tokenServiceProvider],
  exports: [tokenServiceProvider, LoginUseCase],
})
export class AuthModule {}
