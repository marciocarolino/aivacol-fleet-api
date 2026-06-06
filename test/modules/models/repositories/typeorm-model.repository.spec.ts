import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';
import { ModelTypeOrmEntity } from '../../../../src/app/modules/models/persistence/model.typeorm-entity';
import { TypeOrmModelRepository } from '../../../../src/app/modules/models/repositories/typeorm-model.repository';

describe('TypeOrmModelRepository', () => {
  const repository = {
    save: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

  let typeOrmModelRepository: TypeOrmModelRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    typeOrmModelRepository = new TypeOrmModelRepository(repository as never);
  });

  function makePersistence(): ModelTypeOrmEntity {
    const persistence = new ModelTypeOrmEntity();
    persistence.id = 'model-id';
    persistence.name = 'Sprinter';
    persistence.brandId = 'brand-id';
    persistence.createdBy = 'system';

    return persistence;
  }

  it('should save a model using TypeORM repository', async () => {
    const model = new ModelEntity('model-id', 'Sprinter', 'brand-id', 'system');
    const persistence = makePersistence();

    repository.save.mockResolvedValue(persistence);

    await expect(typeOrmModelRepository.save(model)).resolves.toEqual(model);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining(persistence),
    );
  });

  it('should find a model by id', async () => {
    const persistence = makePersistence();

    repository.findOne.mockResolvedValue(persistence);

    await expect(typeOrmModelRepository.findById('model-id')).resolves.toEqual(
      new ModelEntity(
        persistence.id,
        persistence.name,
        persistence.brandId,
        persistence.createdBy,
      ),
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'model-id' },
    });
  });

  it('should return null when model is not found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      typeOrmModelRepository.findById('model-id'),
    ).resolves.toBeNull();
  });

  it('should find a model by name', async () => {
    const persistence = makePersistence();

    repository.findOne.mockResolvedValue(persistence);

    await expect(
      typeOrmModelRepository.findByName(persistence.name),
    ).resolves.toEqual(
      new ModelEntity(
        persistence.id,
        persistence.name,
        persistence.brandId,
        persistence.createdBy,
      ),
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { name: persistence.name },
    });
  });

  it('should return null when model is not found by name', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      typeOrmModelRepository.findByName('missing'),
    ).resolves.toBeNull();
  });

  it('should delete a model by id', async () => {
    repository.delete.mockResolvedValue(undefined);

    await expect(
      typeOrmModelRepository.delete('model-id'),
    ).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('model-id');
  });

  it('should check if a brand has models', async () => {
    repository.count.mockResolvedValue(1);

    await expect(
      typeOrmModelRepository.existsByBrandId('brand-id'),
    ).resolves.toBe(true);
    expect(repository.count).toHaveBeenCalledWith({
      where: { brandId: 'brand-id' },
    });
  });
});
