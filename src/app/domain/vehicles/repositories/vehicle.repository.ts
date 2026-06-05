import { VehicleEntity } from '../entities/vehicle.entity';

export interface VehicleRepository {
  save(vehicle: VehicleEntity): Promise<VehicleEntity>;

  findById(id: string): Promise<VehicleEntity | null>;

  findByLicensePlate(licensePlate: string): Promise<VehicleEntity | null>;

  existsByModelId(modelId: string): Promise<boolean>;

  delete(id: string): Promise<void>;
}
