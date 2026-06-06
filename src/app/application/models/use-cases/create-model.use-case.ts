import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import type { ModelRepository } from '../../../domain/models/repositories/model.repository';
import type { BrandRepository } from '../../../domain/brands/repositories/brand.repository';

import type { CreateModelInput } from '../inputs/create-model.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { ModelEntity } from '../../../domain/models/entities/model.entity';

@Injectable()
export class CreateModelUseCase {
  constructor(
    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,

    @Inject('BrandRepository')
    private readonly brandRepository: BrandRepository,
  ) {}

  async execute(input: CreateModelInput): Promise<ModelEntity> {
    const brand = await this.brandRepository.findById(input.brandId);

    if (!brand) {
      throw new AppException('Brand not found', HttpStatus.NOT_FOUND);
    }

    const modelExists = await this.modelRepository.findByName(input.name);

    if (modelExists) {
      throw new AppException('Model already exists', HttpStatus.CONFLICT);
    }

    const model = new ModelEntity(
      randomUUID(),
      input.name,
      input.brandId,
      input.createdBy,
    );

    return this.modelRepository.save(model);
  }
}
