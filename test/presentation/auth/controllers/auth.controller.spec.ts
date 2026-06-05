import { HttpStatus } from '@nestjs/common';

import { AuthController } from '../../../../src/app/presentation/auth/controllers/auth.controller';
import { AppException } from '../../../../src/app/shared/exceptions/app.exception';

describe('AuthController', () => {
  const loginUseCase = {
    execute: jest.fn(),
  };

  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(loginUseCase as never);
  });

  it('should login using LoginUseCase', async () => {
    const dto = {
      email: 'marcio@email.com',
      password: '123456',
    };

    loginUseCase.execute.mockResolvedValue({ accessToken: 'access-token' });

    await expect(controller.login(dto)).resolves.toEqual({
      accessToken: 'access-token',
    });
    expect(loginUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should propagate login errors', async () => {
    const exception = new AppException(
      'Invalid credentials',
      HttpStatus.UNAUTHORIZED,
    );

    loginUseCase.execute.mockRejectedValue(exception);

    await expect(
      controller.login({ email: 'marcio@email.com', password: 'wrong' }),
    ).rejects.toBe(exception);
  });
});
