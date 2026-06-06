import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { BrandRepository } from '../../../domain/brands/repositories/brand.repository';
import type { ModelRepository } from '../../../domain/models/repositories/model.repository';
import { AppException } from '../../../shared/exceptions/app.exception';

import type { DeleteBrandInput } from '../inputs/delete-brand.input';

@Injectable()
export class DeleteBrandUseCase {
  constructor(
    @Inject('BrandRepository')
    private readonly brandRepository: BrandRepository,

    @Inject('ModelRepository')
    private readonly modelRepository: ModelRepository,
  ) {}

  async execute(input: DeleteBrandInput): Promise<void> {
    const brand = await this.brandRepository.findById(input.id);

    if (!brand) {
      throw new AppException('Brand not found', HttpStatus.NOT_FOUND);
    }

    const hasModels = await this.modelRepository.existsByBrandId(input.id);

    if (hasModels) {
      throw new AppException('Brand is in use', HttpStatus.CONFLICT);
    }

    await this.brandRepository.delete(input.id);
  }
}
