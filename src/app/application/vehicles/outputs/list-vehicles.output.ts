import { VehicleEntity } from '../../../domain/vehicles/entities/vehicle.entity';

export interface ListVehiclesOutput {
  items: VehicleEntity[];
  total: number;
  page: number;
  limit: number;
}
