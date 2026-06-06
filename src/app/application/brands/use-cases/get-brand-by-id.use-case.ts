import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { BrandEntity } from '../../../domain/brands/entities/brand.entity';
import type { BrandRepository } from '../../../domain/brands/repositories/brand.repository';
import { AppException } from '../../../shared/exceptions/app.exception';

import type { GetBrandByIdInput } from '../inputs/get-brand-by-id.input';

@Injectable()
export class GetBrandByIdUseCase {
  constructor(
    @Inject('BrandRepository')
    private readonly brandRepository: BrandRepository,
  ) {}

  async execute(input: GetBrandByIdInput): Promise<BrandEntity> {
    const brand = await this.brandRepository.findById(input.id);

    if (!brand) {
      throw new AppException('Brand not found', HttpStatus.NOT_FOUND);
    }

    return brand;
  }
}
