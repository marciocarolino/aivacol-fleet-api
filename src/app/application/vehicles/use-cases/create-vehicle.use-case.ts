import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import type { VehicleRepository } from '../../../domain/vehicles/repositories/vehicle.repository';

import type { CreateVehicleInput } from '../inputs/create-vehicle.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { VehicleEntity } from '../../../domain/vehicles/entities/vehicle.entity';
import type { ModelRepository } from '../../../domain/models/repositories/model.repository';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,

    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,
  ) {}

  async execute(input: CreateVehicleInput): Promise<VehicleEntity> {
    const model = await this.modelRepository.findById(input.modelId);

    if (!model) {
      throw new AppException('Model not found', HttpStatus.NOT_FOUND);
    }

    const vehicleExists = await this.vehicleRepository.findByLicensePlate(
      input.licensePlate,
    );

    if (vehicleExists) {
      throw new AppException('Vehicle already exists', HttpStatus.CONFLICT);
    }

    const vehicle = new VehicleEntity();

    vehicle.id = randomUUID();
    vehicle.licensePlate = input.licensePlate;
    vehicle.chassis = input.chassis;
    vehicle.renavam = input.renavam;
    vehicle.year = input.year;
    vehicle.modelId = input.modelId;
    vehicle.createdBy = input.createdBy;

    return this.vehicleRepository.save(vehicle);
  }
}
