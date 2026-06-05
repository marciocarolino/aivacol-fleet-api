import { HttpStatus } from '@nestjs/common';

import { GetVehicleByIdUseCase } from '../../../../src/app/application/vehicles/use-cases/get-vehicle-by-id.use-case';
import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';

describe('GetVehicleByIdUseCase', () => {
  const vehicleRepository = {
    save: jest.fn(),
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

  let useCase: GetVehicleByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetVehicleByIdUseCase(
      vehicleRepository,
      redisCacheService as never,
    );
  });

  it('should return cached vehicle when cache exists', async () => {
    const vehicle = new VehicleEntity();

    redisCacheService.get.mockResolvedValue(vehicle);

    await expect(useCase.execute({ id: 'vehicle-id' })).resolves.toBe(vehicle);
    expect(redisCacheService.get).toHaveBeenCalledWith('vehicle:vehicle-id');
    expect(vehicleRepository.findById).not.toHaveBeenCalled();
  });

  it('should return a vehicle from repository and cache it when cache is empty', async () => {
    const vehicle = new VehicleEntity();

    redisCacheService.get.mockResolvedValue(null);
    vehicleRepository.findById.mockResolvedValue(vehicle);

    await expect(useCase.execute({ id: 'vehicle-id' })).resolves.toBe(vehicle);
    expect(vehicleRepository.findById).toHaveBeenCalledWith('vehicle-id');
    expect(redisCacheService.set).toHaveBeenCalledWith(
      'vehicle:vehicle-id',
      vehicle,
    );
  });

  it('should throw not found when vehicle does not exist', async () => {
    redisCacheService.get.mockResolvedValue(null);
    vehicleRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'vehicle-id' })).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Vehicle not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(redisCacheService.set).not.toHaveBeenCalled();
  });
});
