import { HttpStatus } from '@nestjs/common';

import { UpdateModelUseCase } from '../../../../src/app/application/models/use-cases/update-model.use-case';
import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';
import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';

describe('UpdateModelUseCase', () => {
  const modelRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    existsByBrandId: jest.fn(),
    delete: jest.fn(),
  };
  const brandRepository = {
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

  const input = {
    id: 'model-id',
    name: 'Updated model',
    brandId: 'brand-id',
  };

  let useCase: UpdateModelUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateModelUseCase(
      modelRepository,
      brandRepository,
      redisCacheService as never,
    );
  });

  it('should update a model when it exists and name is available', async () => {
    const model = new ModelEntity(
      input.id,
      'Old model',
      'old-brand-id',
      'system',
    );
    const updatedModel = new ModelEntity(
      input.id,
      input.name,
      input.brandId,
      model.createdBy,
    );

    modelRepository.findById.mockResolvedValue(model);
    brandRepository.findById.mockResolvedValue(
      new BrandEntity(input.brandId, 'Mercedes-Benz', 'system'),
    );
    modelRepository.findByName.mockResolvedValue(null);
    modelRepository.save.mockResolvedValue(updatedModel);

    await expect(useCase.execute(input)).resolves.toBe(updatedModel);
    expect(modelRepository.save).toHaveBeenCalledWith(updatedModel);
    expect(redisCacheService.delete).toHaveBeenCalledWith(
      `model:${updatedModel.id}`,
    );
  });

  it('should allow keeping the same name from the same model', async () => {
    const model = new ModelEntity(
      input.id,
      input.name,
      input.brandId,
      'system',
    );

    modelRepository.findById.mockResolvedValue(model);
    brandRepository.findById.mockResolvedValue(
      new BrandEntity(input.brandId, 'Mercedes-Benz', 'system'),
    );
    modelRepository.findByName.mockResolvedValue(model);
    modelRepository.save.mockResolvedValue(model);

    await expect(useCase.execute(input)).resolves.toBe(model);
  });

  it('should throw not found when model does not exist', async () => {
    modelRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Model not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(modelRepository.findByName).not.toHaveBeenCalled();
    expect(modelRepository.save).not.toHaveBeenCalled();
  });

  it('should throw not found when brand does not exist', async () => {
    modelRepository.findById.mockResolvedValue(
      new ModelEntity(input.id, 'Old model', 'old-brand-id', 'system'),
    );
    brandRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Brand not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(modelRepository.findByName).not.toHaveBeenCalled();
    expect(modelRepository.save).not.toHaveBeenCalled();
  });

  it('should throw conflict when name belongs to another model', async () => {
    modelRepository.findById.mockResolvedValue(
      new ModelEntity(input.id, 'Old model', 'old-brand-id', 'system'),
    );
    brandRepository.findById.mockResolvedValue(
      new BrandEntity(input.brandId, 'Mercedes-Benz', 'system'),
    );
    modelRepository.findByName.mockResolvedValue(
      new ModelEntity('another-id', input.name, input.brandId, 'system'),
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Model already exists',
        statusCode: HttpStatus.CONFLICT,
      },
    });

    expect(modelRepository.save).not.toHaveBeenCalled();
  });
});
