import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import type { UserRepository } from '../../../domain/users/repositories/user.repository';
import type { PasswordHashService } from '../../../domain/users/services/password-hash.service';
import type { CreateUserInput } from '../inputs/create-user.input';
import { AppException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('PasswordHashService')
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const userAlreadyExists = await this.userRepository.findByEmail(
      input.email,
    );

    if (userAlreadyExists) {
      throw new AppException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.passwordHashService.hash(input.password);

    const userId = randomUUID();

    const user = new UserEntity(
      userId,
      input.nickname,
      input.name,
      input.email,
      hashedPassword,
    );

    return this.userRepository.save(user);
  }
}
