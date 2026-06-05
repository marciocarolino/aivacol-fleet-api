import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRepository } from '../../../domain/users/repositories/user.repository';
import { UserEntity } from '../../../domain/users/entities/user.entity';

import { UserMapper } from '../mappers/user.mapper';
import { UserTypeOrmEntity } from '../persistence/user.typeorm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const persistenceEntity = UserMapper.toPersistence(user);

    const savedUser = await this.repository.save(persistenceEntity);

    return UserMapper.toDomain(savedUser);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
