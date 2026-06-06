import { Inject, Injectable } from '@nestjs/common';

import type { VehicleRepository } from '../../../domain/vehicles/repositories/vehicle.repository';
import { RedisCacheService } from '../../../modules/cache/services/redis-cache.service';
import type { ListVehiclesInput } from '../inputs/list-vehicles.input';
import type { ListVehiclesOutput } from '../outputs/list-vehicles.output';

@Injectable()
export class ListVehiclesUseCase {
  constructor(
    @Inject('VehicleRepository')
    private readonly vehicleRepository: VehicleRepository,

    private readonly redisCacheService: RedisCacheService,
  ) {}

  async execute(input: ListVehiclesInput): Promise<ListVehiclesOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const filters = {
      licensePlate: input.licensePlate,
      chassis: input.chassis,
      renavam: input.renavam,
      year: input.year,
      modelId: input.modelId,
    };
    const cacheItemKey = JSON.stringify({ page, limit, filters });
    const cachedList =
      await this.redisCacheService.get<Record<string, ListVehiclesOutput>>(
        'vehicles:list',
      );

    if (cachedList?.[cacheItemKey]) {
      return cachedList[cacheItemKey];
    }

    const result = await this.vehicleRepository.findAll({
      page,
      limit,
      filters,
    });
    const output = {
      items: result.items,
      total: result.total,
      page,
      limit,
    };

    await this.redisCacheService.set('vehicles:list', {
      ...(cachedList ?? {}),
      [cacheItemKey]: output,
    });

    return output;
  }
}
