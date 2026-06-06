/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

import {
  FindAllVehiclesOptions,
  FindAllVehiclesResult,
  VehicleRepository,
} from '../../../domain/vehicles/repositories/vehicle.repository';
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

  async findAll(
    options: FindAllVehiclesOptions,
  ): Promise<FindAllVehiclesResult> {
    const where: FindOptionsWhere<VehicleTypeOrmEntity> = {};

    if (options.filters.licensePlate) {
      where.licensePlate = Like(`%${options.filters.licensePlate}%`);
    }

    if (options.filters.chassis) {
      where.chassis = Like(`%${options.filters.chassis}%`);
    }

    if (options.filters.renavam) {
      where.renavam = Like(`%${options.filters.renavam}%`);
    }

    if (options.filters.year) {
      where.year = options.filters.year;
    }

    if (options.filters.modelId) {
      where.modelId = options.filters.modelId;
    }

    const [vehicles, total] = await this.repository.findAndCount({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      items: vehicles.map(VehicleMapper.toDomain),
      total,
    };
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
