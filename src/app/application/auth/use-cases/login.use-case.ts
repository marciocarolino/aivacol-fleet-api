import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { UserRepository } from '../../../domain/users/repositories/user.repository';
import type { PasswordHashService } from '../../../domain/users/services/password-hash.service';
import type { TokenService } from '../../../domain/auth/services/token.service';

import type { LoginInput } from '../inputs/login.input';
import type { LoginOutput } from '../outputs/login.output';

import { AppException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('PasswordHashService')
    private readonly passwordHashService: PasswordHashService,

    @Inject('TokenService')
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatches = await this.passwordHashService.compare(
      input.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new AppException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
    };
  }
}
