import { HttpStatus } from '@nestjs/common';

import { CreateModelUseCase } from '../../../../src/app/application/models/use-cases/create-model.use-case';
import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';
import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'generated-model-id'),
}));

describe('CreateModelUseCase', () => {
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

  const input = {
    name: 'Sprinter',
    brandId: 'brand-id',
    createdBy: 'system',
  };

  let useCase: CreateModelUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateModelUseCase(modelRepository, brandRepository);
  });

  it('should create a model when name does not exist', async () => {
    const savedModel = new ModelEntity(
      'generated-model-id',
      input.name,
      input.brandId,
      input.createdBy,
    );

    brandRepository.findById.mockResolvedValue(
      new BrandEntity(input.brandId, 'Mercedes-Benz', 'system'),
    );
    modelRepository.findByName.mockResolvedValue(null);
    modelRepository.save.mockResolvedValue(savedModel);

    await expect(useCase.execute(input)).resolves.toBe(savedModel);

    expect(modelRepository.findByName).toHaveBeenCalledWith(input.name);
    expect(modelRepository.save).toHaveBeenCalledWith(savedModel);
  });

  it('should throw conflict when model name already exists', async () => {
    brandRepository.findById.mockResolvedValue(
      new BrandEntity(input.brandId, 'Mercedes-Benz', 'system'),
    );
    modelRepository.findByName.mockResolvedValue(
      new ModelEntity(
        'existing-id',
        input.name,
        input.brandId,
        input.createdBy,
      ),
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

  it('should throw not found when brand does not exist', async () => {
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
});
