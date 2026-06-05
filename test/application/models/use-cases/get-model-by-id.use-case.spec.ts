import { HttpStatus } from '@nestjs/common';

import { GetModelByIdUseCase } from '../../../../src/app/application/models/use-cases/get-model-by-id.use-case';
import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';

describe('GetModelByIdUseCase', () => {
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

  let useCase: GetModelByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetModelByIdUseCase(
      modelRepository,
      redisCacheService as never,
    );
  });

  it('should return cached model when cache exists', async () => {
    const model = new ModelEntity('model-id', 'Sprinter', 'system');

    redisCacheService.get.mockResolvedValue(model);

    await expect(useCase.execute({ id: 'model-id' })).resolves.toBe(model);
    expect(redisCacheService.get).toHaveBeenCalledWith('model:model-id');
    expect(modelRepository.findById).not.toHaveBeenCalled();
  });

  it('should return a model from repository and cache it when cache is empty', async () => {
    const model = new ModelEntity('model-id', 'Sprinter', 'system');

    redisCacheService.get.mockResolvedValue(null);
    modelRepository.findById.mockResolvedValue(model);
    redisCacheService.set.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'model-id' })).resolves.toBe(model);
    expect(modelRepository.findById).toHaveBeenCalledWith('model-id');
    expect(redisCacheService.set).toHaveBeenCalledWith('model:model-id', model);
  });

  it('should throw not found when model does not exist', async () => {
    redisCacheService.get.mockResolvedValue(null);
    modelRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'model-id' })).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Model not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });
    expect(redisCacheService.set).not.toHaveBeenCalled();
  });
});
