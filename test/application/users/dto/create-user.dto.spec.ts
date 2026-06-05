import { CreateUserDto } from '../../../../src/app/application/users/dto/create-user.dto';

describe('Application CreateUserDto', () => {
  it('should create dto with assigned values', () => {
    const dto = new CreateUserDto();

    dto.nickname = 'aivacol';
    dto.name = 'Aivacol Administrator';
    dto.email = 'admin@aivacol.com';
    dto.password = '123456';

    expect(dto).toEqual({
      nickname: 'aivacol',
      name: 'Aivacol Administrator',
      email: 'admin@aivacol.com',
      password: '123456',
    });
  });
});
