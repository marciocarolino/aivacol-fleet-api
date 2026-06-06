import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { BrandEntity } from '../../../domain/brands/entities/brand.entity';
import type { BrandRepository } from '../../../domain/brands/repositories/brand.repository';
import { AppException } from '../../../shared/exceptions/app.exception';

import type { CreateBrandInput } from '../inputs/create-brand.input';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    @Inject('BrandRepository')
    private readonly brandRepository: BrandRepository,
  ) {}

  async execute(input: CreateBrandInput): Promise<BrandEntity> {
    const brandExists = await this.brandRepository.findByName(input.name);

    if (brandExists) {
      throw new AppException('Brand already exists', HttpStatus.CONFLICT);
    }

    const brand = new BrandEntity(randomUUID(), input.name, input.createdBy);

    return this.brandRepository.save(brand);
  }
}
