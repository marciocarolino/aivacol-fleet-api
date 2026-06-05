import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { VehicleRepository } from '../../../domain/vehicles/repositories/vehicle.repository';
import type { ModelRepository } from '../../../domain/models/repositories/model.repository';

import type { UpdateVehicleInput } from '../inputs/update-vehicle.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { VehicleEntity } from '../../../domain/vehicles/entities/vehicle.entity';
import { RedisCacheService } from '../../../modules/cache/services/redis-cache.service';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,

    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,

    private readonly redisCacheService: RedisCacheService,
  ) {}

  async execute(input: UpdateVehicleInput): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findById(input.id);

    if (!vehicle) {
      throw new AppException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    const vehicleWithSamePlate =
      await this.vehicleRepository.findByLicensePlate(input.licensePlate);

    if (vehicleWithSamePlate && vehicleWithSamePlate.id !== input.id) {
      throw new AppException('Vehicle already exists', HttpStatus.CONFLICT);
    }

    const model = await this.modelRepository.findById(input.modelId);

    if (!model) {
      throw new AppException('Model not found', HttpStatus.NOT_FOUND);
    }

    const updatedVehicle = new VehicleEntity();

    updatedVehicle.id = vehicle.id;
    updatedVehicle.licensePlate = input.licensePlate;
    updatedVehicle.chassis = input.chassis;
    updatedVehicle.renavam = input.renavam;
    updatedVehicle.year = input.year;
    updatedVehicle.modelId = input.modelId;
    updatedVehicle.createdBy = vehicle.createdBy;

    const savedVehicle = await this.vehicleRepository.save(updatedVehicle);

    await Promise.all([
      this.redisCacheService.delete(`vehicle:${savedVehicle.id}`),
      this.redisCacheService.delete('vehicles:list'),
    ]);

    return savedVehicle;
  }
}
