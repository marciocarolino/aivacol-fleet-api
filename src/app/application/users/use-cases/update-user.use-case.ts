import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { UserRepository } from '../../../domain/users/repositories/user.repository';

import type { UpdateUserInput } from '../inputs/update-user.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { UserEntity } from '../../../domain/users/entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: UpdateUserInput): Promise<UserEntity> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new AppException('User not found', HttpStatus.NOT_FOUND);
    }

    const userWithSameEmail = await this.userRepository.findByEmail(
      input.email,
    );

    if (userWithSameEmail && userWithSameEmail.id !== input.id) {
      throw new AppException('User already exists', HttpStatus.CONFLICT);
    }

    const updatedUser = new UserEntity(
      user.id,
      input.nickname,
      input.name,
      input.email,
      user.password,
      user.createdBy,
    );

    return this.userRepository.save(updatedUser);
  }
}
