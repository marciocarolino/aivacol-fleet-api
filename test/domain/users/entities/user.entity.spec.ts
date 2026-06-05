import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';

describe('UserEntity', () => {
  it('should create a user entity with provided values', () => {
    const user = new UserEntity(
      'user-id',
      'marcio',
      'Marcio',
      'marcio@email.com',
      'hashed-password',
      'marcio@email.com',
    );

    expect(user).toEqual({
      id: 'user-id',
      nickname: 'marcio',
      name: 'Marcio',
      email: 'marcio@email.com',
      password: 'hashed-password',
      createdBy: 'marcio@email.com',
    });
  });
});
