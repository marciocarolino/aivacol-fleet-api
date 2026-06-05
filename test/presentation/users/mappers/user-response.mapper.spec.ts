import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';
import { UserResponseMapper } from '../../../../src/app/presentation/users/mappers/user-response.mapper';

describe('UserResponseMapper', () => {
  it('should map user domain entity to response without password', () => {
    const user = new UserEntity(
      'user-id',
      'marcio',
      'Marcio',
      'marcio@email.com',
      'hash',
      'creator@email.com',
    );

    const response = UserResponseMapper.toResponse(user);

    expect(response).toEqual({
      id: user.id,
      nickname: user.nickname,
      name: user.name,
      email: user.email,
      createdBy: user.createdBy,
    });
    expect(response).not.toHaveProperty('password');
  });
});
