import { HttpStatus } from '@nestjs/common';

import { GetUserByIdUseCase } from '../../../../src/app/application/users/use-cases/get-user-by-id.use-case';
import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';

describe('GetUserByIdUseCase', () => {
  const userRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: GetUserByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetUserByIdUseCase(userRepository);
  });

  it('should return a user when found', async () => {
    const user = new UserEntity(
      'user-id',
      'nick',
      'Name',
      'email@test.com',
      'hash',
      'creator',
    );

    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute({ id: 'user-id' })).resolves.toBe(user);
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
  });

  it('should throw not found when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'user-id' })).rejects.toMatchObject({
      response: {
        success: false,
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });
  });
});
