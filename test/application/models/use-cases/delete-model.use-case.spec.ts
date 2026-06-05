import { HttpStatus } from '@nestjs/common';

import { DeleteModelUseCase } from '../../../../src/app/application/models/use-cases/delete-model.use-case';
import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';

describe('DeleteModelUseCase', () => {
  const modelRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    delete: jest.fn(),
  };
  const redisCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: DeleteModelUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteModelUseCase(
      modelRepository,
      redisCacheService as never,
    );
  });

  it('should delete a model when it exists', async () => {
    modelRepository.findById.mockResolvedValue(
      new ModelEntity('model-id', 'Sprinter', 'system'),
    );
    modelRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'model-id' })).resolves.toBeUndefined();
    expect(modelRepository.delete).toHaveBeenCalledWith('model-id');
    expect(redisCacheService.delete).toHaveBeenCalledWith('model:model-id');
  });

  it('should throw not found when model does not exist', async () => {
    modelRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'model-id' })).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Model not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(modelRepository.delete).not.toHaveBeenCalled();
    expect(redisCacheService.delete).not.toHaveBeenCalled();
  });
});
