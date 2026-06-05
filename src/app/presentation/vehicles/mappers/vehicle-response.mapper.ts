import { VehicleEntity } from '../../../domain/vehicles/entities/vehicle.entity';

import { VehicleResponse } from '../responses/vehicle.response';

export class VehicleResponseMapper {
  static toResponse(vehicle: VehicleEntity): VehicleResponse {
    return {
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      chassis: vehicle.chassis,
      renavam: vehicle.renavam,
      year: vehicle.year,
      modelId: vehicle.modelId,
    };
  }
}
