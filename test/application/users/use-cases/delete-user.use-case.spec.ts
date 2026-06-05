import { HttpStatus } from '@nestjs/common';

import { DeleteUserUseCase } from '../../../../src/app/application/users/use-cases/delete-user.use-case';
import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';

describe('DeleteUserUseCase', () => {
  const userRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete a user when it exists', async () => {
    userRepository.findById.mockResolvedValue(
      new UserEntity(
        'user-id',
        'nick',
        'Name',
        'email@test.com',
        'hash',
        'creator',
      ),
    );
    userRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'user-id' })).resolves.toBeUndefined();
    expect(userRepository.delete).toHaveBeenCalledWith('user-id');
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

    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
