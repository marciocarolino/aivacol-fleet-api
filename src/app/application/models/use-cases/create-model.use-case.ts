import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import type { ModelRepository } from '../../../domain/models/repositories/model.repository';

import type { CreateModelInput } from '../inputs/create-model.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { ModelEntity } from '../../../domain/models/entities/model.entity';

@Injectable()
export class CreateModelUseCase {
  constructor(
    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,
  ) {}

  async execute(input: CreateModelInput): Promise<ModelEntity> {
    const modelExists = await this.modelRepository.findByName(input.name);

    if (modelExists) {
      throw new AppException('Model already exists', HttpStatus.CONFLICT);
    }

    const model = new ModelEntity(randomUUID(), input.name, input.createdBy);

    return this.modelRepository.save(model);
  }
}
