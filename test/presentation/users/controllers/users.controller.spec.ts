import { HttpStatus } from '@nestjs/common';

import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';
import { UsersController } from '../../../../src/app/presentation/users/controllers/users.controller';
import { AppException } from '../../../../src/app/shared/exceptions/app.exception';

describe('UsersController', () => {
  const createUserUseCase = { execute: jest.fn() };
  const getUserByIdUseCase = { execute: jest.fn() };
  const getUserByEmailUseCase = { execute: jest.fn() };
  const deleteUserUseCase = { execute: jest.fn() };
  const updateUserUseCase = { execute: jest.fn() };

  let controller: UsersController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UsersController(
      createUserUseCase as never,
      getUserByIdUseCase as never,
      getUserByEmailUseCase as never,
      deleteUserUseCase as never,
      updateUserUseCase as never,
    );
  });

  function makeUser(): UserEntity {
    return new UserEntity(
      'user-id',
      'marcio',
      'Marcio',
      'marcio@email.com',
      'hash',
      'creator@email.com',
    );
  }

  it('should create a user and return response', async () => {
    const dto = {
      nickname: 'marcio',
      name: 'Marcio',
      email: 'marcio@email.com',
      password: '123456',
    };

    createUserUseCase.execute.mockResolvedValue(makeUser());

    await expect(controller.create(dto)).resolves.toEqual({
      id: 'user-id',
      nickname: 'marcio',
      name: 'Marcio',
      email: 'marcio@email.com',
      createdBy: 'creator@email.com',
    });
    expect(createUserUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should find a user by id and return response', async () => {
    getUserByIdUseCase.execute.mockResolvedValue(makeUser());

    await expect(controller.findById('user-id')).resolves.toEqual({
      id: 'user-id',
      nickname: 'marcio',
      name: 'Marcio',
      email: 'marcio@email.com',
      createdBy: 'creator@email.com',
    });
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith({ id: 'user-id' });
  });

  it('should find a user by email and return response', async () => {
    getUserByEmailUseCase.execute.mockResolvedValue(makeUser());

    await expect(controller.findByEmail('marcio@email.com')).resolves.toEqual({
      id: 'user-id',
      nickname: 'marcio',
      name: 'Marcio',
      email: 'marcio@email.com',
      createdBy: 'creator@email.com',
    });
    expect(getUserByEmailUseCase.execute).toHaveBeenCalledWith({
      email: 'marcio@email.com',
    });
  });

  it('should delete a user by id', async () => {
    deleteUserUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.delete('user-id')).resolves.toBeUndefined();
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith({ id: 'user-id' });
  });

  it('should update a user and return response', async () => {
    const dto = {
      nickname: 'updated',
      name: 'Updated',
      email: 'updated@email.com',
    };
    const updatedUser = new UserEntity(
      'user-id',
      dto.nickname,
      dto.name,
      dto.email,
      'hash',
      'creator@email.com',
    );

    updateUserUseCase.execute.mockResolvedValue(updatedUser);

    await expect(controller.update('user-id', dto)).resolves.toEqual({
      id: 'user-id',
      nickname: dto.nickname,
      name: dto.name,
      email: dto.email,
      createdBy: 'creator@email.com',
    });
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'user-id',
      ...dto,
    });
  });

  it('should propagate use case errors', async () => {
    const exception = new AppException('User not found', HttpStatus.NOT_FOUND);

    getUserByIdUseCase.execute.mockRejectedValue(exception);

    await expect(controller.findById('missing-id')).rejects.toBe(exception);
  });
});
