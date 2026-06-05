import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { ModelRepository } from '../../../domain/models/repositories/model.repository';

import type { GetModelByIdInput } from '../inputs/get-model-by-id.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { ModelEntity } from '../../../domain/models/entities/model.entity';
import { RedisCacheService } from '../../../modules/cache/services/redis-cache.service';

@Injectable()
export class GetModelByIdUseCase {
  constructor(
    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,

    private readonly redisCacheService: RedisCacheService,
  ) {}

  async execute(input: GetModelByIdInput): Promise<ModelEntity> {
    const cacheKey = `model:${input.id}`;

    const cachedModels =
      await this.redisCacheService.get<ModelEntity>(cacheKey);

    if (cachedModels) {
      return cachedModels;
    }

    const model = await this.modelRepository.findById(input.id);

    if (!model) {
      throw new AppException('Model not found', HttpStatus.NOT_FOUND);
    }

    await this.redisCacheService.set(cacheKey, model);

    return model;
  }
}
