import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { ModelRepository } from '../../../domain/models/repositories/model.repository';
import type { BrandRepository } from '../../../domain/brands/repositories/brand.repository';

import type { UpdateModelInput } from '../inputs/update-model.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { ModelEntity } from '../../../domain/models/entities/model.entity';
import { RedisCacheService } from '../../../modules/cache/services/redis-cache.service';

@Injectable()
export class UpdateModelUseCase {
  constructor(
    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,

    @Inject('BrandRepository')
    private readonly brandRepository: BrandRepository,

    private readonly redisCacheService: RedisCacheService,
  ) {}

  async execute(input: UpdateModelInput): Promise<ModelEntity> {
    const model = await this.modelRepository.findById(input.id);

    if (!model) {
      throw new AppException('Model not found', HttpStatus.NOT_FOUND);
    }

    const brand = await this.brandRepository.findById(input.brandId);

    if (!brand) {
      throw new AppException('Brand not found', HttpStatus.NOT_FOUND);
    }

    const modelWithSameName = await this.modelRepository.findByName(input.name);

    if (modelWithSameName && modelWithSameName.id !== input.id) {
      throw new AppException('Model already exists', HttpStatus.CONFLICT);
    }

    const updatedModel = new ModelEntity(
      model.id,
      input.name,
      input.brandId,
      model.createdBy,
    );

    const savedModel = await this.modelRepository.save(updatedModel);

    await this.redisCacheService.delete(`model:${savedModel.id}`);

    return savedModel;
  }
}
