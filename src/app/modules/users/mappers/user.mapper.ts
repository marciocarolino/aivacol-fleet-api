import { UserEntity } from '../../../domain/users/entities/user.entity';
import { UserTypeOrmEntity } from '../persistence/user.typeorm-entity';

export class UserMapper {
  static toPersistence(user: UserEntity): UserTypeOrmEntity {
    const persistence = new UserTypeOrmEntity();

    persistence.id = user.id;
    persistence.nickname = user.nickname;
    persistence.name = user.name;
    persistence.email = user.email;
    persistence.password = user.password;
    persistence.createdBy = user.createdBy;

    return persistence;
  }

  static toDomain(persistence: UserTypeOrmEntity): UserEntity {
    return new UserEntity(
      persistence.id,
      persistence.nickname,
      persistence.name,
      persistence.email,
      persistence.password,
      persistence.createdBy,
    );
  }
}
