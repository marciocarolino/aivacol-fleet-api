import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { UserRepository } from '../../../domain/users/repositories/user.repository';

import type { DeleteUserInput } from '../inputs/delete-user.input';

import { AppException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete(input.id);
  }
}
