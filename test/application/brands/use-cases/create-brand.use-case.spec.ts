import { HttpStatus } from '@nestjs/common';

import { CreateBrandUseCase } from '../../../../src/app/application/brands/use-cases/create-brand.use-case';
import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'generated-brand-id'),
}));

describe('CreateBrandUseCase', () => {
  const brandRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    delete: jest.fn(),
  };

  const input = {
    name: 'Mercedes-Benz',
    createdBy: 'system',
  };

  let useCase: CreateBrandUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateBrandUseCase(brandRepository);
  });

  it('should create a brand when name does not exist', async () => {
    const savedBrand = new BrandEntity(
      'generated-brand-id',
      input.name,
      input.createdBy,
    );

    brandRepository.findByName.mockResolvedValue(null);
    brandRepository.save.mockResolvedValue(savedBrand);

    await expect(useCase.execute(input)).resolves.toBe(savedBrand);

    expect(brandRepository.findByName).toHaveBeenCalledWith(input.name);
    expect(brandRepository.save).toHaveBeenCalledWith(savedBrand);
  });

  it('should throw conflict when brand name already exists', async () => {
    brandRepository.findByName.mockResolvedValue(
      new BrandEntity('existing-id', input.name, input.createdBy),
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Brand already exists',
        statusCode: HttpStatus.CONFLICT,
      },
    });

    expect(brandRepository.save).not.toHaveBeenCalled();
  });
});
