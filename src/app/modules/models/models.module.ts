import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModelTypeOrmEntity } from './persistence/model.typeorm-entity';
import { TypeOrmModelRepository } from './repositories/typeorm-model.repository';

import { CreateModelUseCase } from '../../application/models/use-cases/create-model.use-case';
import { GetModelByIdUseCase } from '../../application/models/use-cases/get-model-by-id.use-case';
import { UpdateModelUseCase } from '../../application/models/use-cases/update-model.use-case';
import { DeleteModelUseCase } from '../../application/models/use-cases/delete-model.use-case';

import { ModelsController } from '../../presentation/Models/controllers/models.controller';

const modelRepositoryProvider = {
  provide: 'ModelRepository',
  useExisting: TypeOrmModelRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([ModelTypeOrmEntity])],
  controllers: [ModelsController],
  providers: [
    TypeOrmModelRepository,

    CreateModelUseCase,
    GetModelByIdUseCase,
    UpdateModelUseCase,
    DeleteModelUseCase,

    modelRepositoryProvider,
  ],
  exports: [modelRepositoryProvider],
})
export class ModelsModule {}
