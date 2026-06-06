import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';
import { BrandMapper } from '../../../../src/app/modules/brands/mappers/brand.mapper';
import { BrandTypeOrmEntity } from '../../../../src/app/modules/brands/persistence/brand.typeorm-entity';

describe('BrandMapper', () => {
  it('should map brand domain entity to persistence entity', () => {
    const brand = new BrandEntity('brand-id', 'Mercedes-Benz', 'system');

    const persistence = BrandMapper.toPersistence(brand);

    expect(persistence).toBeInstanceOf(BrandTypeOrmEntity);
    expect(persistence).toEqual(
      expect.objectContaining({
        id: brand.id,
        name: brand.name,
        createdBy: brand.createdBy,
      }),
    );
  });

  it('should map persistence entity to brand domain entity', () => {
    const persistence = new BrandTypeOrmEntity();
    persistence.id = 'brand-id';
    persistence.name = 'Mercedes-Benz';
    persistence.createdBy = 'system';

    const brand = BrandMapper.toDomain(persistence);

    expect(brand).toEqual(
      new BrandEntity(persistence.id, persistence.name, persistence.createdBy),
    );
  });
});
