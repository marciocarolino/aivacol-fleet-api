import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { VehicleRepository } from '../../../domain/vehicles/repositories/vehicle.repository';

import type { GetVehicleByIdInput } from '../inputs/get-vehicle-by-id.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { VehicleEntity } from '../../../domain/vehicles/entities/vehicle.entity';

@Injectable()
export class GetVehicleByIdUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(input: GetVehicleByIdInput): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findById(input.id);

    if (!vehicle) {
      throw new AppException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    return vehicle;
  }
}
