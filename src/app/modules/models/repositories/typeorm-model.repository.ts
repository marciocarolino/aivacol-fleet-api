import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ModelRepository } from '../../../domain/models/repositories/model.repository';
import { ModelEntity } from '../../../domain/models/entities/model.entity';

import { ModelMapper } from '../mappers/model.mapper';
import { ModelTypeOrmEntity } from '../persistence/model.typeorm-entity';

@Injectable()
export class TypeOrmModelRepository implements ModelRepository {
  constructor(
    @InjectRepository(ModelTypeOrmEntity)
    private readonly repository: Repository<ModelTypeOrmEntity>,
  ) {}

  async save(model: ModelEntity): Promise<ModelEntity> {
    const persistenceEntity = ModelMapper.toPersistence(model);

    const savedModel = await this.repository.save(persistenceEntity);

    return ModelMapper.toDomain(savedModel);
  }

  async findById(id: string): Promise<ModelEntity | null> {
    const model = await this.repository.findOne({
      where: { id },
    });

    if (!model) {
      return null;
    }

    return ModelMapper.toDomain(model);
  }

  async findByName(name: string): Promise<ModelEntity | null> {
    const model = await this.repository.findOne({
      where: { name },
    });

    if (!model) {
      return null;
    }

    return ModelMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
