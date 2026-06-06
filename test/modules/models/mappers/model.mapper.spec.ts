import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';
import { ModelMapper } from '../../../../src/app/modules/models/mappers/model.mapper';
import { ModelTypeOrmEntity } from '../../../../src/app/modules/models/persistence/model.typeorm-entity';

describe('ModelMapper', () => {
  it('should map model domain entity to persistence entity', () => {
    const model = new ModelEntity('model-id', 'Sprinter', 'brand-id', 'system');

    const persistence = ModelMapper.toPersistence(model);

    expect(persistence).toBeInstanceOf(ModelTypeOrmEntity);
    expect(persistence).toEqual(
      expect.objectContaining({
        id: model.id,
        name: model.name,
        brandId: model.brandId,
        createdBy: model.createdBy,
      }),
    );
  });

  it('should map persistence entity to model domain entity', () => {
    const persistence = new ModelTypeOrmEntity();
    persistence.id = 'model-id';
    persistence.name = 'Sprinter';
    persistence.brandId = 'brand-id';
    persistence.createdBy = 'system';

    const model = ModelMapper.toDomain(persistence);

    expect(model).toEqual(
      new ModelEntity(
        persistence.id,
        persistence.name,
        persistence.brandId,
        persistence.createdBy,
      ),
    );
  });
});
