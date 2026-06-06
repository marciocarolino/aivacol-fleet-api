import { HttpStatus } from '@nestjs/common';

import { UpdateBrandUseCase } from '../../../../src/app/application/brands/use-cases/update-brand.use-case';
import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';

describe('UpdateBrandUseCase', () => {
  const brandRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    delete: jest.fn(),
  };

  const input = {
    id: 'brand-id',
    name: 'Updated brand',
  };

  let useCase: UpdateBrandUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateBrandUseCase(brandRepository);
  });

  it('should update a brand when it exists and name is available', async () => {
    const brand = new BrandEntity(input.id, 'Old brand', 'system');
    const updatedBrand = new BrandEntity(input.id, input.name, brand.createdBy);

    brandRepository.findById.mockResolvedValue(brand);
    brandRepository.findByName.mockResolvedValue(null);
    brandRepository.save.mockResolvedValue(updatedBrand);

    await expect(useCase.execute(input)).resolves.toBe(updatedBrand);
    expect(brandRepository.save).toHaveBeenCalledWith(updatedBrand);
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

    expect(brandRepository.save).not.toHaveBeenCalled();
  });

  it('should throw conflict when name belongs to another brand', async () => {
    brandRepository.findById.mockResolvedValue(
      new BrandEntity(input.id, 'Old brand', 'system'),
    );
    brandRepository.findByName.mockResolvedValue(
      new BrandEntity('another-id', input.name, 'system'),
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
