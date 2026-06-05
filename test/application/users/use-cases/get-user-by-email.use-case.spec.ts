import { HttpStatus } from '@nestjs/common';

import { GetUserByEmailUseCase } from '../../../../src/app/application/users/use-cases/get-user-by-email.use-case';
import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';

describe('GetUserByEmailUseCase', () => {
  const userRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: GetUserByEmailUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetUserByEmailUseCase(userRepository);
  });

  it('should return a user when found by email', async () => {
    const user = new UserEntity(
      'user-id',
      'nick',
      'Name',
      'email@test.com',
      'hash',
      'creator',
    );

    userRepository.findByEmail.mockResolvedValue(user);

    await expect(useCase.execute({ email: user.email })).resolves.toBe(user);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
  });

  it('should throw not found when user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'missing@test.com' }),
    ).rejects.toMatchObject({
      response: {
        success: false,
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });
  });
});
