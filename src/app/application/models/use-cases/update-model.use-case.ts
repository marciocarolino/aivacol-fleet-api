import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { ModelRepository } from '../../../domain/models/repositories/model.repository';

import type { UpdateModelInput } from '../inputs/update-model.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { ModelEntity } from '../../../domain/models/entities/model.entity';

@Injectable()
export class UpdateModelUseCase {
  constructor(
    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,
  ) {}

  async execute(input: UpdateModelInput): Promise<ModelEntity> {
    const model = await this.modelRepository.findById(input.id);

    if (!model) {
      throw new AppException('Model not found', HttpStatus.NOT_FOUND);
    }

    const modelWithSameName = await this.modelRepository.findByName(input.name);

    if (modelWithSameName && modelWithSameName.id !== input.id) {
      throw new AppException('Model already exists', HttpStatus.CONFLICT);
    }

    const updatedModel = new ModelEntity(model.id, input.name, model.createdBy);

    return this.modelRepository.save(updatedModel);
  }
}
