import { HttpStatus } from '@nestjs/common';

import { CreateUserUseCase } from '../../../../src/app/application/users/use-cases/create-user.use-case';
import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';
import { AppException } from '../../../../src/app/shared/exceptions/app.exception';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'generated-user-id'),
}));

describe('CreateUserUseCase', () => {
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

  const input = {
    nickname: 'marcio',
    name: 'Marcio',
    email: 'marcio@email.com',
    password: '123456',
  };

  let useCase: CreateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateUserUseCase(userRepository, passwordHashService);
  });

  it('should create a user when email does not exist', async () => {
    const savedUser = new UserEntity(
      'generated-user-id',
      input.nickname,
      input.name,
      input.email,
      'hashed-password',
      input.email,
    );

    userRepository.findByEmail.mockResolvedValue(null);
    passwordHashService.hash.mockResolvedValue('hashed-password');
    userRepository.save.mockResolvedValue(savedUser);

    await expect(useCase.execute(input)).resolves.toBe(savedUser);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordHashService.hash).toHaveBeenCalledWith(input.password);
    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
  });

  it('should throw conflict when email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue(
      new UserEntity(
        'existing-id',
        'nick',
        'Name',
        input.email,
        'hash',
        input.email,
      ),
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'User already exists',
        statusCode: HttpStatus.CONFLICT,
      },
    } satisfies Partial<AppException>);

    expect(passwordHashService.hash).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
