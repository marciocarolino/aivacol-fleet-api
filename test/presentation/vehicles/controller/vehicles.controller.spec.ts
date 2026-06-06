import { HttpStatus } from '@nestjs/common';

import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';
import { VehiclesController } from '../../../../src/app/presentation/vehicles/controller/vehicles.controller';
import { AppException } from '../../../../src/app/shared/exceptions/app.exception';

describe('VehiclesController', () => {
  const createVehicleUseCase = { execute: jest.fn() };
  const listVehiclesUseCase = { execute: jest.fn() };
  const getVehicleByIdUseCase = { execute: jest.fn() };
  const updateVehicleUseCase = { execute: jest.fn() };
  const deleteVehicleUseCase = { execute: jest.fn() };
  const authenticatedRequest = {
    user: {
      userId: 'user-id',
      email: 'creator@email.com',
    },
  };

  let controller: VehiclesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new VehiclesController(
      createVehicleUseCase as never,
      listVehiclesUseCase as never,
      getVehicleByIdUseCase as never,
      updateVehicleUseCase as never,
      deleteVehicleUseCase as never,
    );
  });

  function makeVehicle(): VehicleEntity {
    return Object.assign(new VehicleEntity(), {
      id: 'vehicle-id',
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
      createdBy: 'system',
    });
  }

  it('should create a vehicle and return response', async () => {
    const dto = {
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
    };

    createVehicleUseCase.execute.mockResolvedValue(makeVehicle());

    await expect(
      controller.create(dto, authenticatedRequest as never),
    ).resolves.toEqual({
      id: 'vehicle-id',
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
    });
    expect(createVehicleUseCase.execute).toHaveBeenCalledWith({
      ...dto,
      createdBy: 'creator@email.com',
    });
  });

  it('should find a vehicle by id and return response', async () => {
    getVehicleByIdUseCase.execute.mockResolvedValue(makeVehicle());

    await expect(controller.findById('vehicle-id')).resolves.toEqual({
      id: 'vehicle-id',
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
    });
    expect(getVehicleByIdUseCase.execute).toHaveBeenCalledWith({
      id: 'vehicle-id',
    });
  });

  it('should list vehicles with pagination and filters', async () => {
    listVehiclesUseCase.execute.mockResolvedValue({
      items: [makeVehicle()],
      total: 1,
      page: 2,
      limit: 5,
    });

    await expect(
      controller.findAll({
        page: 2,
        limit: 5,
        renavam: 'renavam',
        year: 2024,
      }),
    ).resolves.toEqual({
      items: [
        {
          id: 'vehicle-id',
          licensePlate: 'ABC1234',
          chassis: 'chassis',
          renavam: 'renavam',
          year: 2024,
          modelId: 'model-id',
        },
      ],
      total: 1,
      page: 2,
      limit: 5,
    });
    expect(listVehiclesUseCase.execute).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      renavam: 'renavam',
      year: 2024,
    });
  });

  it('should update a vehicle and return response', async () => {
    const dto = {
      licensePlate: 'XYZ9876',
      chassis: 'new-chassis',
      renavam: 'new-renavam',
      year: 2025,
      modelId: 'model-id',
    };
    const vehicle = Object.assign(makeVehicle(), dto);

    updateVehicleUseCase.execute.mockResolvedValue(vehicle);

    await expect(controller.update('vehicle-id', dto)).resolves.toEqual({
      id: 'vehicle-id',
      licensePlate: dto.licensePlate,
      chassis: dto.chassis,
      renavam: dto.renavam,
      year: dto.year,
      modelId: dto.modelId,
    });
    expect(updateVehicleUseCase.execute).toHaveBeenCalledWith({
      id: 'vehicle-id',
      ...dto,
    });
  });

  it('should delete a vehicle by id', async () => {
    deleteVehicleUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.delete('vehicle-id')).resolves.toBeUndefined();
    expect(deleteVehicleUseCase.execute).toHaveBeenCalledWith({
      id: 'vehicle-id',
    });
  });

  it('should propagate use case errors', async () => {
    const exception = new AppException(
      'Vehicle not found',
      HttpStatus.NOT_FOUND,
    );

    getVehicleByIdUseCase.execute.mockRejectedValue(exception);

    await expect(controller.findById('missing-id')).rejects.toBe(exception);
  });
});
