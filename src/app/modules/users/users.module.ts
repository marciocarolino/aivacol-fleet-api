import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTypeOrmEntity } from './persistence/user.typeorm-entity';
import { TypeOrmUserRepository } from './repositories/typeorm-user.repository';
import { BcryptPasswordHashService } from '../../domain/users/services/bcrypt-password-hash.service';
import { CreateUserUseCase } from '../../application/users/use-cases/create-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
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
