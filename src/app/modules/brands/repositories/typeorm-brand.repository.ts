import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BrandEntity } from '../../../domain/brands/entities/brand.entity';
import { BrandRepository } from '../../../domain/brands/repositories/brand.repository';

import { BrandMapper } from '../mappers/brand.mapper';
import { BrandTypeOrmEntity } from '../persistence/brand.typeorm-entity';

@Injectable()
export class TypeOrmBrandRepository implements BrandRepository {
  constructor(
    @InjectRepository(BrandTypeOrmEntity)
    private readonly repository: Repository<BrandTypeOrmEntity>,
  ) {}

  async save(brand: BrandEntity): Promise<BrandEntity> {
    const persistenceEntity = BrandMapper.toPersistence(brand);

    const savedBrand = await this.repository.save(persistenceEntity);

    return BrandMapper.toDomain(savedBrand);
  }

  async findById(id: string): Promise<BrandEntity | null> {
    const brand = await this.repository.findOne({
      where: { id },
    });

    if (!brand) {
      return null;
    }

    return BrandMapper.toDomain(brand);
  }

  async findByName(name: string): Promise<BrandEntity | null> {
    const brand = await this.repository.findOne({
      where: { name },
    });

    if (!brand) {
      return null;
    }

    return BrandMapper.toDomain(brand);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
