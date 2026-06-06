import { VehicleResponse } from './vehicle.response';

export class PaginatedVehiclesResponse {
  items: VehicleResponse[];
  total: number;
  page: number;
  limit: number;
}
