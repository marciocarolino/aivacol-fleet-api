import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';

describe('VehicleEntity', () => {
  it('should create a vehicle entity with assigned values', () => {
    const vehicle = new VehicleEntity();
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const updatedAt = new Date('2026-01-02T00:00:00.000Z');

    vehicle.id = 'vehicle-id';
    vehicle.licensePlate = 'ABC1234';
    vehicle.chassis = 'chassis';
    vehicle.renavam = 'renavam';
    vehicle.year = 2024;
    vehicle.modelId = 'model-id';
    vehicle.createdBy = 'system';
    vehicle.createdAt = createdAt;
    vehicle.updatedAt = updatedAt;

    expect(vehicle).toEqual({
      id: 'vehicle-id',
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
      createdBy: 'system',
      createdAt,
      updatedAt,
    });
  });
});
