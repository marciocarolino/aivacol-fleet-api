import { HttpStatus } from '@nestjs/common';

import { DeleteBrandUseCase } from '../../../../src/app/application/brands/use-cases/delete-brand.use-case';
import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';

describe('DeleteBrandUseCase', () => {
  const brandRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    delete: jest.fn(),
  };
  const modelRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    existsByBrandId: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: DeleteBrandUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteBrandUseCase(brandRepository, modelRepository);
  });

  it('should delete a brand when it exists and has no models', async () => {
    brandRepository.findById.mockResolvedValue(
      new BrandEntity('brand-id', 'Mercedes-Benz', 'system'),
    );
    modelRepository.existsByBrandId.mockResolvedValue(false);
    brandRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'brand-id' })).resolves.toBeUndefined();
    expect(brandRepository.delete).toHaveBeenCalledWith('brand-id');
  });

  it('should throw not found when brand does not exist', async () => {
    brandRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'brand-id' })).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Brand not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(modelRepository.existsByBrandId).not.toHaveBeenCalled();
    expect(brandRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw conflict when brand has models', async () => {
    brandRepository.findById.mockResolvedValue(
      new BrandEntity('brand-id', 'Mercedes-Benz', 'system'),
    );
    modelRepository.existsByBrandId.mockResolvedValue(true);

    await expect(useCase.execute({ id: 'brand-id' })).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Brand is in use',
        statusCode: HttpStatus.CONFLICT,
      },
    });

    expect(brandRepository.delete).not.toHaveBeenCalled();
  });
});
