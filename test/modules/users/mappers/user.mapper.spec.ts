import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';
import { UserMapper } from '../../../../src/app/modules/users/mappers/user.mapper';
import { UserTypeOrmEntity } from '../../../../src/app/modules/users/persistence/user.typeorm-entity';

describe('UserMapper', () => {
  it('should map user domain entity to persistence entity', () => {
    const user = new UserEntity(
      'user-id',
      'marcio',
      'Marcio',
      'marcio@email.com',
      'hash',
      'creator@email.com',
    );

    const persistence = UserMapper.toPersistence(user);

    expect(persistence).toBeInstanceOf(UserTypeOrmEntity);
    expect(persistence).toEqual(
      expect.objectContaining({
        id: user.id,
        nickname: user.nickname,
        name: user.name,
        email: user.email,
        password: user.password,
        createdBy: user.createdBy,
      }),
    );
  });

  it('should map persistence entity to user domain entity', () => {
    const persistence = new UserTypeOrmEntity();
    persistence.id = 'user-id';
    persistence.nickname = 'marcio';
    persistence.name = 'Marcio';
    persistence.email = 'marcio@email.com';
    persistence.password = 'hash';
    persistence.createdBy = 'creator@email.com';

    const user = UserMapper.toDomain(persistence);

    expect(user).toEqual(
      new UserEntity(
        persistence.id,
        persistence.nickname,
        persistence.name,
        persistence.email,
        persistence.password,
        persistence.createdBy,
      ),
    );
  });
});
