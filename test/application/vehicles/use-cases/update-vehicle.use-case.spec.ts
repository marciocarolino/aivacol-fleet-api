import { HttpStatus } from '@nestjs/common';

import { UpdateVehicleUseCase } from '../../../../src/app/application/vehicles/use-cases/update-vehicle.use-case';
import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';
import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';

describe('UpdateVehicleUseCase', () => {
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
    id: 'vehicle-id',
    licensePlate: 'XYZ9876',
    chassis: 'new-chassis',
    renavam: 'new-renavam',
    year: 2025,
    modelId: 'model-id',
  };

  let useCase: UpdateVehicleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateVehicleUseCase(
      vehicleRepository,
      modelRepository,
      redisCacheService as never,
    );
  });

  function makeVehicle(): VehicleEntity {
    return Object.assign(new VehicleEntity(), {
      id: 'vehicle-id',
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'old-model-id',
      createdBy: 'system',
    });
  }

  it('should update a vehicle when vehicle and model exist', async () => {
    const vehicle = makeVehicle();
    const updatedVehicle = Object.assign(new VehicleEntity(), {
      ...input,
      createdBy: vehicle.createdBy,
    });

    vehicleRepository.findById.mockResolvedValue(vehicle);
    vehicleRepository.findByLicensePlate.mockResolvedValue(null);
    modelRepository.findById.mockResolvedValue(
      new ModelEntity('model-id', 'Sprinter', 'system'),
    );
    vehicleRepository.save.mockResolvedValue(updatedVehicle);

    await expect(useCase.execute(input)).resolves.toBe(updatedVehicle);
    expect(vehicleRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(updatedVehicle),
    );
    expect(redisCacheService.delete).toHaveBeenCalledWith('vehicle:vehicle-id');
    expect(redisCacheService.delete).toHaveBeenCalledWith('vehicles:list');
  });

  it('should allow keeping the same license plate from the same vehicle', async () => {
    const vehicle = Object.assign(makeVehicle(), {
      licensePlate: input.licensePlate,
    });

    vehicleRepository.findById.mockResolvedValue(vehicle);
    vehicleRepository.findByLicensePlate.mockResolvedValue(vehicle);
    modelRepository.findById.mockResolvedValue(
      new ModelEntity('model-id', 'Sprinter', 'system'),
    );
    vehicleRepository.save.mockResolvedValue(vehicle);

    await expect(useCase.execute(input)).resolves.toBe(vehicle);
    expect(redisCacheService.delete).toHaveBeenCalledWith('vehicle:vehicle-id');
    expect(redisCacheService.delete).toHaveBeenCalledWith('vehicles:list');
  });

  it('should throw not found when vehicle does not exist', async () => {
    vehicleRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Vehicle not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(vehicleRepository.findByLicensePlate).not.toHaveBeenCalled();
    expect(vehicleRepository.save).not.toHaveBeenCalled();
    expect(redisCacheService.delete).not.toHaveBeenCalled();
  });

  it('should throw conflict when license plate belongs to another vehicle', async () => {
    vehicleRepository.findById.mockResolvedValue(makeVehicle());
    vehicleRepository.findByLicensePlate.mockResolvedValue(
      Object.assign(new VehicleEntity(), { id: 'another-vehicle-id' }),
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Vehicle already exists',
        statusCode: HttpStatus.CONFLICT,
      },
    });

    expect(modelRepository.findById).not.toHaveBeenCalled();
    expect(vehicleRepository.save).not.toHaveBeenCalled();
    expect(redisCacheService.delete).not.toHaveBeenCalled();
  });

  it('should throw not found when model does not exist', async () => {
    vehicleRepository.findById.mockResolvedValue(makeVehicle());
    vehicleRepository.findByLicensePlate.mockResolvedValue(null);
    modelRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Model not found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    });

    expect(vehicleRepository.save).not.toHaveBeenCalled();
    expect(redisCacheService.delete).not.toHaveBeenCalled();
  });
});
