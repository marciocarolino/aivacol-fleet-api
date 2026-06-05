import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';
import { VehicleMapper } from '../../../../src/app/modules/vehicles/mappers/vehicle.mapper';
import { VehicleTypeOrmEntity } from '../../../../src/app/modules/vehicles/persistence/vehicle.typeorm-entity';

describe('VehicleMapper', () => {
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

  it('should map vehicle domain entity to persistence entity', () => {
    const vehicle = makeVehicle();

    const persistence = VehicleMapper.toPersistence(vehicle);

    expect(persistence).toBeInstanceOf(VehicleTypeOrmEntity);
    expect(persistence).toEqual(expect.objectContaining(vehicle));
  });

  it('should map persistence entity to vehicle domain entity', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const updatedAt = new Date('2026-01-02T00:00:00.000Z');
    const persistence = Object.assign(new VehicleTypeOrmEntity(), {
      ...makeVehicle(),
      createdAt,
      updatedAt,
    });

    const vehicle = VehicleMapper.toDomain(persistence);

    expect(vehicle).toEqual(
      expect.objectContaining({
        id: persistence.id,
        licensePlate: persistence.licensePlate,
        chassis: persistence.chassis,
        renavam: persistence.renavam,
        year: persistence.year,
        modelId: persistence.modelId,
        createdBy: persistence.createdBy,
        createdAt,
        updatedAt,
      }),
    );
  });
});
