import { HttpStatus } from '@nestjs/common';

import { UpdateUserUseCase } from '../../../../src/app/application/users/use-cases/update-user.use-case';
import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';

describe('UpdateUserUseCase', () => {
  const userRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    delete: jest.fn(),
  };

  const input = {
    id: 'user-id',
    nickname: 'newnick',
    name: 'New Name',
    email: 'new@email.com',
  };

  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateUserUseCase(userRepository);
  });

  it('should update a user when it exists and email is available', async () => {
    const user = new UserEntity(
      input.id,
      'oldnick',
      'Old Name',
      'old@email.com',
      'hash',
      'creator@email.com',
    );
    const updatedUser = new UserEntity(
      input.id,
      input.nickname,
      input.name,
      input.email,
      user.password,
      user.createdBy,
    );

    userRepository.findById.mockResolvedValue(user);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockResolvedValue(updatedUser);

    await expect(useCase.execute(input)).resolves.toBe(updatedUser);
    expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
  });

  it('should allow keeping the same email from the same user', async () => {
    const user = new UserEntity(
      input.id,
      'oldnick',
      'Old Name',
      input.email,
      'hash',
      'creator@email.com',
    );

    userRepository.findById.mockResolvedValue(user);
    userRepository.findByEmail.mockResolvedValue(user);
    userRepository.save.mockResolvedValue(user);

    await expect(useCase.execute(input)).resolves.toBe(user);
  });

  it('should throw not found when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw conflict when email belongs to another user', async () => {
    userRepository.findById.mockResolvedValue(
      new UserEntity(
        input.id,
        'nick',
        'Name',
        'old@email.com',
        'hash',
        'creator',
      ),
    );
    userRepository.findByEmail.mockResolvedValue(
      new UserEntity(
        'another-id',
        'nick',
        'Name',
        input.email,
        'hash',
        'creator',
      ),
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'User already exists',
        statusCode: HttpStatus.CONFLICT,
      },
    });

    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
