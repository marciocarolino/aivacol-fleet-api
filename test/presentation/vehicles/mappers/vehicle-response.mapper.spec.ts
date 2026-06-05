import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';
import { VehicleResponseMapper } from '../../../../src/app/presentation/vehicles/mappers/vehicle-response.mapper';

describe('VehicleResponseMapper', () => {
  it('should map vehicle domain entity to response', () => {
    const vehicle = Object.assign(new VehicleEntity(), {
      id: 'vehicle-id',
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
      createdBy: 'system',
    });

    expect(VehicleResponseMapper.toResponse(vehicle)).toEqual({
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      chassis: vehicle.chassis,
      renavam: vehicle.renavam,
      year: vehicle.year,
      modelId: vehicle.modelId,
    });
  });
});
