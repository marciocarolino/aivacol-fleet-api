import { HttpStatus } from '@nestjs/common';

import { CreateVehicleUseCase } from '../../../../src/app/application/vehicles/use-cases/create-vehicle.use-case';
import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';
import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'generated-vehicle-id'),
}));

describe('CreateVehicleUseCase', () => {
  const vehicleRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByLicensePlate: jest.fn(),
    existsByModelId: jest.fn(),
    delete: jest.fn(),
  };
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

  const input = {
    licensePlate: 'ABC1234',
    chassis: 'chassis',
    renavam: 'renavam',
    year: 2024,
    modelId: 'model-id',
    createdBy: 'system',
  };

  let useCase: CreateVehicleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateVehicleUseCase(
      vehicleRepository,
      modelRepository,
      redisCacheService as never,
    );
  });

  it('should create a vehicle when model exists and license plate is available', async () => {
    const savedVehicle = Object.assign(new VehicleEntity(), {
      id: 'generated-vehicle-id',
      ...input,
    });

    modelRepository.findById.mockResolvedValue(
      new ModelEntity('model-id', 'Sprinter', 'system'),
    );
    vehicleRepository.findByLicensePlate.mockResolvedValue(null);
    vehicleRepository.save.mockResolvedValue(savedVehicle);

    await expect(useCase.execute(input)).resolves.toBe(savedVehicle);
    expect(modelRepository.findById).toHaveBeenCalledWith(input.modelId);
    expect(vehicleRepository.findByLicensePlate).toHaveBeenCalledWith(
      input.licensePlate,
    );
    expect(vehicleRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'generated-vehicle-id',
        ...input,
      }),
    );
    expect(redisCacheService.delete).toHaveBeenCalledWith('vehicles:list');
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

    expect(vehicleRepository.findByLicensePlate).not.toHaveBeenCalled();
    expect(vehicleRepository.save).not.toHaveBeenCalled();
    expect(redisCacheService.delete).not.toHaveBeenCalled();
  });

  it('should throw conflict when vehicle license plate already exists', async () => {
    modelRepository.findById.mockResolvedValue(
      new ModelEntity('model-id', 'Sprinter', 'system'),
    );
    vehicleRepository.findByLicensePlate.mockResolvedValue(new VehicleEntity());

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Vehicle already exists',
        statusCode: HttpStatus.CONFLICT,
      },
    });

    expect(vehicleRepository.save).not.toHaveBeenCalled();
    expect(redisCacheService.delete).not.toHaveBeenCalled();
  });
});
