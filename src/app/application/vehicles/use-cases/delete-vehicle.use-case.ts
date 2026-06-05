import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { VehicleRepository } from '../../../domain/vehicles/repositories/vehicle.repository';

import type { DeleteVehicleInput } from '../inputs/delete-vehicle.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { RedisCacheService } from '../../../modules/cache/services/redis-cache.service';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,

    private readonly redisCacheService: RedisCacheService,
  ) {}

  async execute(input: DeleteVehicleInput): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(input.id);

    if (!vehicle) {
      throw new AppException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    await this.vehicleRepository.delete(input.id);

    await this.redisCacheService.delete(`vehicle:${input.id}`);
  }
}
