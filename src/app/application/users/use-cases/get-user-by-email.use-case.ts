import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { UserRepository } from '../../../domain/users/repositories/user.repository';
import type { GetUserByEmailInput } from '../inputs/get-user-by-email.input';

import { AppException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: GetUserByEmailInput) {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
