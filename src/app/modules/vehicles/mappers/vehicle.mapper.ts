import { VehicleEntity } from '../../../domain/vehicles/entities/vehicle.entity';

import { VehicleTypeOrmEntity } from '../persistence/vehicle.typeorm-entity';

export class VehicleMapper {
  static toPersistence(vehicle: VehicleEntity): VehicleTypeOrmEntity {
    const persistence = new VehicleTypeOrmEntity();

    persistence.id = vehicle.id;
    persistence.licensePlate = vehicle.licensePlate;
    persistence.chassis = vehicle.chassis;
    persistence.renavam = vehicle.renavam;
    persistence.year = vehicle.year;
    persistence.modelId = vehicle.modelId;
    persistence.createdBy = vehicle.createdBy;

    return persistence;
  }

  static toDomain(persistence: VehicleTypeOrmEntity): VehicleEntity {
    const vehicle = new VehicleEntity();

    vehicle.id = persistence.id;
    vehicle.licensePlate = persistence.licensePlate;
    vehicle.chassis = persistence.chassis;
    vehicle.renavam = persistence.renavam;
    vehicle.year = persistence.year;
    vehicle.modelId = persistence.modelId;
    vehicle.createdBy = persistence.createdBy;
    vehicle.createdAt = persistence.createdAt;
    vehicle.updatedAt = persistence.updatedAt;

    return vehicle;
  }
}
