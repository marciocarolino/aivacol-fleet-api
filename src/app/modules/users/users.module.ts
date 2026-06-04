import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTypeOrmEntity } from './persistence/user.typeorm-entity';
import { TypeOrmUserRepository } from './repositories/typeorm-user.repository';
import { BcryptPasswordHashService } from '../../domain/users/services/bcrypt-password-hash.service';
import { CreateUserUseCase } from '../../application/users/use-cases/create-user.use-case';
import { UsersController } from '../../presentation/users/controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UsersController],
  providers: [
    TypeOrmUserRepository,
    BcryptPasswordHashService,
    CreateUserUseCase,

    {
      provide: 'UserRepository',
      useExisting: TypeOrmUserRepository,
    },

    {
      provide: 'PasswordHashService',
      useExisting: BcryptPasswordHashService,
    },
  ],
})
export class UsersModule {}
