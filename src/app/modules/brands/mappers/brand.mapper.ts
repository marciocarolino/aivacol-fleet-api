import { BrandEntity } from '../../../domain/brands/entities/brand.entity';

import { BrandTypeOrmEntity } from '../persistence/brand.typeorm-entity';

export class BrandMapper {
  static toPersistence(brand: BrandEntity): BrandTypeOrmEntity {
    const persistence = new BrandTypeOrmEntity();

    persistence.id = brand.id;
    persistence.name = brand.name;
    persistence.createdBy = brand.createdBy;

    return persistence;
  }

  static toDomain(persistence: BrandTypeOrmEntity): BrandEntity {
    return new BrandEntity(
      persistence.id,
      persistence.name,
      persistence.createdBy,
    );
  }
}
