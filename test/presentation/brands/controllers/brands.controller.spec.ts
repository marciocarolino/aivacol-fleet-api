import { HttpStatus } from '@nestjs/common';

import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';
import { BrandsController } from '../../../../src/app/presentation/brands/controllers/brands.controller';
import { AppException } from '../../../../src/app/shared/exceptions/app.exception';

describe('BrandsController', () => {
  const createBrandUseCase = { execute: jest.fn() };
  const getBrandByIdUseCase = { execute: jest.fn() };
  const updateBrandUseCase = { execute: jest.fn() };
  const deleteBrandUseCase = { execute: jest.fn() };
  const authenticatedRequest = {
    user: {
      userId: 'user-id',
      email: 'creator@email.com',
    },
  };

  let controller: BrandsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new BrandsController(
      createBrandUseCase as never,
      getBrandByIdUseCase as never,
      updateBrandUseCase as never,
      deleteBrandUseCase as never,
    );
  });

  it('should create a brand and return response', async () => {
    createBrandUseCase.execute.mockResolvedValue(
      new BrandEntity('brand-id', 'Mercedes-Benz', 'creator@email.com'),
    );

    await expect(
      controller.create(
        { name: 'Mercedes-Benz' },
        authenticatedRequest as never,
      ),
    ).resolves.toEqual({
      id: 'brand-id',
      name: 'Mercedes-Benz',
    });
    expect(createBrandUseCase.execute).toHaveBeenCalledWith({
      name: 'Mercedes-Benz',
      createdBy: 'creator@email.com',
    });
  });

  it('should find a brand by id and return response', async () => {
    getBrandByIdUseCase.execute.mockResolvedValue(
      new BrandEntity('brand-id', 'Mercedes-Benz', 'system'),
    );

    await expect(controller.findById('brand-id')).resolves.toEqual({
      id: 'brand-id',
      name: 'Mercedes-Benz',
    });
    expect(getBrandByIdUseCase.execute).toHaveBeenCalledWith({
      id: 'brand-id',
    });
  });

  it('should update a brand and return response', async () => {
    updateBrandUseCase.execute.mockResolvedValue(
      new BrandEntity('brand-id', 'Updated brand', 'system'),
    );

    await expect(
      controller.update('brand-id', { name: 'Updated brand' }),
    ).resolves.toEqual({
      id: 'brand-id',
      name: 'Updated brand',
    });
    expect(updateBrandUseCase.execute).toHaveBeenCalledWith({
      id: 'brand-id',
      name: 'Updated brand',
    });
  });

  it('should delete a brand by id', async () => {
    deleteBrandUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.delete('brand-id')).resolves.toBeUndefined();
    expect(deleteBrandUseCase.execute).toHaveBeenCalledWith({ id: 'brand-id' });
  });

  it('should propagate use case errors', async () => {
    const exception = new AppException('Brand not found', HttpStatus.NOT_FOUND);

    getBrandByIdUseCase.execute.mockRejectedValue(exception);

    await expect(controller.findById('missing-id')).rejects.toBe(exception);
  });
});
