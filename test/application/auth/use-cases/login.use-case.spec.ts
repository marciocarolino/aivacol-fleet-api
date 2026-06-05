import { HttpStatus } from '@nestjs/common';

import { LoginUseCase } from '../../../../src/app/application/auth/use-cases/login.use-case';
import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';

describe('LoginUseCase', () => {
  const userRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    delete: jest.fn(),
  };
  const passwordHashService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  const tokenService = {
    generateAccessToken: jest.fn(),
  };

  let useCase: LoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(
      userRepository,
      passwordHashService,
      tokenService,
    );
  });

  it('should return access token when credentials are valid', async () => {
    const user = new UserEntity(
      'user-id',
      'marcio',
      'Marcio',
      'marcio@email.com',
      'hash',
      'creator',
    );

    userRepository.findByEmail.mockResolvedValue(user);
    passwordHashService.compare.mockResolvedValue(true);
    tokenService.generateAccessToken.mockResolvedValue('access-token');

    await expect(
      useCase.execute({ email: user.email, password: '123456' }),
    ).resolves.toEqual({ accessToken: 'access-token' });
    expect(passwordHashService.compare).toHaveBeenCalledWith(
      '123456',
      user.password,
    );
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    });
  });

  it('should throw unauthorized when user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'missing@email.com', password: '123456' }),
    ).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
    });

    expect(passwordHashService.compare).not.toHaveBeenCalled();
    expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
  });

  it('should throw unauthorized when password does not match', async () => {
    userRepository.findByEmail.mockResolvedValue(
      new UserEntity(
        'user-id',
        'marcio',
        'Marcio',
        'marcio@email.com',
        'hash',
        'creator',
      ),
    );
    passwordHashService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'marcio@email.com', password: 'wrong' }),
    ).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
    });

    expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
  });
});
