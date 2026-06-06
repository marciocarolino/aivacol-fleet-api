import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateBrandUseCase } from '../../application/brands/use-cases/create-brand.use-case';
import { DeleteBrandUseCase } from '../../application/brands/use-cases/delete-brand.use-case';
import { GetBrandByIdUseCase } from '../../application/brands/use-cases/get-brand-by-id.use-case';
import { UpdateBrandUseCase } from '../../application/brands/use-cases/update-brand.use-case';
import { BrandsController } from '../../presentation/brands/controllers/brands.controller';
import { ModelTypeOrmEntity } from '../models/persistence/model.typeorm-entity';
import { TypeOrmModelRepository } from '../models/repositories/typeorm-model.repository';

import { BrandTypeOrmEntity } from './persistence/brand.typeorm-entity';
import { TypeOrmBrandRepository } from './repositories/typeorm-brand.repository';

const brandRepositoryProvider = {
  provide: 'BrandRepository',
  useExisting: TypeOrmBrandRepository,
};

const modelRepositoryProvider = {
  provide: 'ModelRepository',
  useExisting: TypeOrmModelRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([BrandTypeOrmEntity, ModelTypeOrmEntity])],
  controllers: [BrandsController],
  providers: [
    TypeOrmBrandRepository,
    TypeOrmModelRepository,

    CreateBrandUseCase,
    GetBrandByIdUseCase,
    UpdateBrandUseCase,
    DeleteBrandUseCase,

    brandRepositoryProvider,
    modelRepositoryProvider,
  ],
  exports: [brandRepositoryProvider],
})
export class BrandsModule {}
