import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { ModelRepository } from '../../../domain/models/repositories/model.repository';

import type { DeleteModelInput } from '../inputs/delete-model.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { RedisCacheService } from '../../../modules/cache/services/redis-cache.service';

@Injectable()
export class DeleteModelUseCase {
  constructor(
    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,

    private readonly redisCacheService: RedisCacheService,
  ) {}

  async execute(input: DeleteModelInput): Promise<void> {
    const model = await this.modelRepository.findById(input.id);

    if (!model) {
      throw new AppException('Model not found', HttpStatus.NOT_FOUND);
    }

    await this.modelRepository.delete(input.id);

    await this.redisCacheService.delete(`model:${input.id}`);
  }
}
