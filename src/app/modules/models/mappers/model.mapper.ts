import { ModelEntity } from '../../../domain/models/entities/model.entity';

import { ModelTypeOrmEntity } from '../persistence/model.typeorm-entity';

export class ModelMapper {
  static toPersistence(model: ModelEntity): ModelTypeOrmEntity {
    const persistence = new ModelTypeOrmEntity();

    persistence.id = model.id;
    persistence.name = model.name;
    persistence.brandId = model.brandId;
    persistence.createdBy = model.createdBy;

    return persistence;
  }

  static toDomain(persistence: ModelTypeOrmEntity): ModelEntity {
    return new ModelEntity(
      persistence.id,
      persistence.name,
      persistence.brandId,
      persistence.createdBy,
    );
  }
}
