import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { ModelRepository } from '../../../domain/models/repositories/model.repository';

import type { GetModelByIdInput } from '../inputs/get-model-by-id.input';

import { AppException } from '../../../shared/exceptions/app.exception';
import { ModelEntity } from '../../../domain/models/entities/model.entity';

@Injectable()
export class GetModelByIdUseCase {
  constructor(
    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,
  ) {}

  async execute(input: GetModelByIdInput): Promise<ModelEntity> {
    const model = await this.modelRepository.findById(input.id);

    if (!model) {
      throw new AppException('Model not found', HttpStatus.NOT_FOUND);
    }

    return model;
  }
}
