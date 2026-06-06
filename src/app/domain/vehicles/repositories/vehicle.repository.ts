import { VehicleEntity } from '../entities/vehicle.entity';

export interface FindAllVehiclesFilters {
  licensePlate?: string;
  chassis?: string;
  renavam?: string;
  year?: number;
  modelId?: string;
}

export interface FindAllVehiclesOptions {
  page: number;
  limit: number;
  filters: FindAllVehiclesFilters;
}

export interface FindAllVehiclesResult {
  items: VehicleEntity[];
  total: number;
}

export interface VehicleRepository {
  save(vehicle: VehicleEntity): Promise<VehicleEntity>;

  findAll(options: FindAllVehiclesOptions): Promise<FindAllVehiclesResult>;

  findById(id: string): Promise<VehicleEntity | null>;

  findByLicensePlate(licensePlate: string): Promise<VehicleEntity | null>;

  existsByModelId(modelId: string): Promise<boolean>;

  delete(id: string): Promise<void>;
}
