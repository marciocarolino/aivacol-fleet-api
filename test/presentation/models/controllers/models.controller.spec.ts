import { HttpStatus } from '@nestjs/common';

import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';
import { ModelsController } from '../../../../src/app/presentation/models/controllers/models.controller';
import { AppException } from '../../../../src/app/shared/exceptions/app.exception';

describe('ModelsController', () => {
  const createModelUseCase = { execute: jest.fn() };
  const getModelByIdUseCase = { execute: jest.fn() };
  const updateModelUseCase = { execute: jest.fn() };
  const deleteModelUseCase = { execute: jest.fn() };
  const authenticatedRequest = {
    user: {
      userId: 'user-id',
      email: 'creator@email.com',
    },
  };

  let controller: ModelsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ModelsController(
      createModelUseCase as never,
      getModelByIdUseCase as never,
      updateModelUseCase as never,
      deleteModelUseCase as never,
    );
  });

  it('should create a model and return response', async () => {
    createModelUseCase.execute.mockResolvedValue(
      new ModelEntity('model-id', 'Sprinter', 'creator@email.com'),
    );

    await expect(
      controller.create({ name: 'Sprinter' }, authenticatedRequest as never),
    ).resolves.toEqual({
      id: 'model-id',
      name: 'Sprinter',
    });
    expect(createModelUseCase.execute).toHaveBeenCalledWith({
      name: 'Sprinter',
      createdBy: 'creator@email.com',
    });
  });

  it('should find a model by id and return response', async () => {
    getModelByIdUseCase.execute.mockResolvedValue(
      new ModelEntity('model-id', 'Sprinter', 'system'),
    );

    await expect(controller.findById('model-id')).resolves.toEqual({
      id: 'model-id',
      name: 'Sprinter',
    });
    expect(getModelByIdUseCase.execute).toHaveBeenCalledWith({
      id: 'model-id',
    });
  });

  it('should update a model and return response', async () => {
    updateModelUseCase.execute.mockResolvedValue(
      new ModelEntity('model-id', 'Updated model', 'system'),
    );

    await expect(
      controller.update('model-id', { name: 'Updated model' }),
    ).resolves.toEqual({
      id: 'model-id',
      name: 'Updated model',
    });
    expect(updateModelUseCase.execute).toHaveBeenCalledWith({
      id: 'model-id',
      name: 'Updated model',
    });
  });

  it('should delete a model by id', async () => {
    deleteModelUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.delete('model-id')).resolves.toBeUndefined();
    expect(deleteModelUseCase.execute).toHaveBeenCalledWith({ id: 'model-id' });
  });

  it('should propagate use case errors', async () => {
    const exception = new AppException('Model not found', HttpStatus.NOT_FOUND);

    getModelByIdUseCase.execute.mockRejectedValue(exception);

    await expect(controller.findById('missing-id')).rejects.toBe(exception);
  });
});
