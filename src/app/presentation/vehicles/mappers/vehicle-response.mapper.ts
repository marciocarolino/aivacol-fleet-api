/* eslint-disable @typescript-eslint/unbound-method */
import { VehicleEntity } from '../../../domain/vehicles/entities/vehicle.entity';

import { VehicleResponse } from '../responses/vehicle.response';
import { PaginatedVehiclesResponse } from '../responses/paginated-vehicles.response';
import { ListVehiclesOutput } from '../../../application/vehicles/outputs/list-vehicles.output';

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

  static toPaginatedResponse(
    output: ListVehiclesOutput,
  ): PaginatedVehiclesResponse {
    return {
      items: output.items.map(VehicleResponseMapper.toResponse),
      total: output.total,
      page: output.page,
      limit: output.limit,
    };
  }
}
