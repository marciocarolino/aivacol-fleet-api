import { HttpStatus } from '@nestjs/common';

import { GetBrandByIdUseCase } from '../../../../src/app/application/brands/use-cases/get-brand-by-id.use-case';
import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';

describe('GetBrandByIdUseCase', () => {
  const brandRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: GetBrandByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetBrandByIdUseCase(brandRepository);
  });

  it('should return a brand when it exists', async () => {
    const brand = new BrandEntity('brand-id', 'Mercedes-Benz', 'system');

    brandRepository.findById.mockResolvedValue(brand);

    await expect(useCase.execute({ id: 'brand-id' })).resolves.toBe(brand);
    expect(brandRepository.findById).toHaveBeenCalledWith('brand-id');
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
  });
});
