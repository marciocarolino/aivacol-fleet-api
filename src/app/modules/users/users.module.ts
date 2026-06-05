import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTypeOrmEntity } from './persistence/user.typeorm-entity';
import { TypeOrmUserRepository } from './repositories/typeorm-user.repository';
import { BcryptPasswordHashService } from '../../domain/users/services/bcrypt-password-hash.service';
import { CreateUserUseCase } from '../../application/users/use-cases/create-user.use-case';
import { UsersController } from '../../presentation/users/controllers/users.controller';
import { GetUserByIdUseCase } from '../../application/users/use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from '../../application/users/use-cases/get-user-by-email.use-case';
import { DeleteUserUseCase } from '../../application/users/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from '../../application/users/use-cases/update-user.use-case';

const userRepositoryProvider = {
  provide: 'UserRepository',
  useExisting: TypeOrmUserRepository,
};

const passwordHashProvider = {
  provide: 'PasswordHashService',
  useExisting: BcryptPasswordHashService,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UsersController],
  providers: [
    TypeOrmUserRepository,
    BcryptPasswordHashService,
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    BcryptPasswordHashService,

    userRepositoryProvider,
    passwordHashProvider,
  ],
  exports: [userRepositoryProvider, passwordHashProvider],
})
export class UsersModule {}
