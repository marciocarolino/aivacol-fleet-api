import { LoginDto } from '../../../../src/app/presentation/auth/dtos/login.dto';

describe('LoginDto', () => {
  it('should create dto with assigned values', () => {
    const dto = new LoginDto();

    dto.email = 'marcio@email.com';
    dto.password = '123456';

    expect(dto).toEqual({
      email: 'marcio@email.com',
      password: '123456',
    });
  });
});
