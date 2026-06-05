import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VehicleRepository } from '../../../domain/vehicles/repositories/vehicle.repository';
import { VehicleEntity } from '../../../domain/vehicles/entities/vehicle.entity';

import { VehicleMapper } from '../mappers/vehicle.mapper';
import { VehicleTypeOrmEntity } from '../persistence/vehicle.typeorm-entity';

@Injectable()
export class TypeOrmVehicleRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleTypeOrmEntity)
    private readonly repository: Repository<VehicleTypeOrmEntity>,
  ) {}

  async save(vehicle: VehicleEntity): Promise<VehicleEntity> {
    const persistenceEntity = VehicleMapper.toPersistence(vehicle);

    const savedVehicle = await this.repository.save(persistenceEntity);

    return VehicleMapper.toDomain(savedVehicle);
  }

  async findById(id: string): Promise<VehicleEntity | null> {
    const vehicle = await this.repository.findOne({
      where: { id },
    });

    if (!vehicle) {
      return null;
    }

    return VehicleMapper.toDomain(vehicle);
  }

  async findByLicensePlate(
    licensePlate: string,
  ): Promise<VehicleEntity | null> {
    const vehicle = await this.repository.findOne({
      where: { licensePlate },
    });

    if (!vehicle) {
      return null;
    }

    return VehicleMapper.toDomain(vehicle);
  }

  async existsByModelId(modelId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { modelId },
    });

    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
