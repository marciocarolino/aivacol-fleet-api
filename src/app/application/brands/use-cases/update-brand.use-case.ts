import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { BrandEntity } from '../../../domain/brands/entities/brand.entity';
import type { BrandRepository } from '../../../domain/brands/repositories/brand.repository';
import { AppException } from '../../../shared/exceptions/app.exception';

import type { UpdateBrandInput } from '../inputs/update-brand.input';

@Injectable()
export class UpdateBrandUseCase {
  constructor(
    @Inject('BrandRepository')
    private readonly brandRepository: BrandRepository,
  ) {}

  async execute(input: UpdateBrandInput): Promise<BrandEntity> {
    const brand = await this.brandRepository.findById(input.id);

    if (!brand) {
      throw new AppException('Brand not found', HttpStatus.NOT_FOUND);
    }

    const brandWithSameName = await this.brandRepository.findByName(input.name);

    if (brandWithSameName && brandWithSameName.id !== input.id) {
      throw new AppException('Brand already exists', HttpStatus.CONFLICT);
    }

    const updatedBrand = new BrandEntity(brand.id, input.name, brand.createdBy);

    return this.brandRepository.save(updatedBrand);
  }
}
