import { HttpStatus } from '@nestjs/common';

import { DeleteVehicleUseCase } from '../../../../src/app/application/vehicles/use-cases/delete-vehicle.use-case';
import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';

describe('DeleteVehicleUseCase', () => {
  const vehicleRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByLicensePlate: jest.fn(),
    existsByModelId: jest.fn(),
    delete: jest.fn(),
  };
  const redisCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: DeleteVehicleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteVehicleUseCase(
      vehicleRepository,
      redisCacheService as never,
    );
  });

  it('should delete a vehicle and clear cache when it exists', async () => {
    vehicleRepository.findById.mockResolvedValue(new VehicleEntity());

    await expect(
      useCase.execute({ id: 'vehicle-id' }),
    ).resolves.toBeUndefined();
    expect(vehicleRepository.delete).toHaveBeenCalledWith('vehicle-id');
    expect(redisCacheService.delete).toHaveBeenCalledWith('vehicle:vehicle-id');
    expect(redisCacheService.delete).toHaveBeenCalledWith('vehicles:list');
  });

  it('should throw not found when vehicle does not exist', async () => {
    vehicleRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'vehicle-id' })).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Vehicle not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(vehicleRepository.delete).not.toHaveBeenCalled();
    expect(redisCacheService.delete).not.toHaveBeenCalled();
  });
});
