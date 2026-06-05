import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { UserRepository } from '../../../domain/users/repositories/user.repository';

import type { GetUserByIdInput } from '../inputs/get-user-by-id.input';

import { AppException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: GetUserByIdInput) {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
