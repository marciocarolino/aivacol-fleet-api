import { UserResponse } from '../../../../src/app/presentation/users/responses/user.response';

describe('UserResponse', () => {
  it('should create response with assigned values', () => {
    const response = new UserResponse();

    response.id = 'user-id';
    response.nickname = 'marcio';
    response.name = 'Marcio';
    response.email = 'marcio@email.com';
    response.createdBy = 'system';

    expect(response).toEqual({
      id: 'user-id',
      nickname: 'marcio',
      name: 'Marcio',
      email: 'marcio@email.com',
      createdBy: 'system',
    });
  });
});
