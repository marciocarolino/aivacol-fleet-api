import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';
import { BrandTypeOrmEntity } from '../../../../src/app/modules/brands/persistence/brand.typeorm-entity';
import { TypeOrmBrandRepository } from '../../../../src/app/modules/brands/repositories/typeorm-brand.repository';

describe('TypeOrmBrandRepository', () => {
  const repository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  let typeOrmBrandRepository: TypeOrmBrandRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    typeOrmBrandRepository = new TypeOrmBrandRepository(repository as never);
  });

  function makePersistence(): BrandTypeOrmEntity {
    const persistence = new BrandTypeOrmEntity();
    persistence.id = 'brand-id';
    persistence.name = 'Mercedes-Benz';
    persistence.createdBy = 'system';

    return persistence;
  }

  it('should save a brand using TypeORM repository', async () => {
    const brand = new BrandEntity('brand-id', 'Mercedes-Benz', 'system');
    const persistence = makePersistence();

    repository.save.mockResolvedValue(persistence);

    await expect(typeOrmBrandRepository.save(brand)).resolves.toEqual(brand);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining(persistence),
    );
  });

  it('should find a brand by id', async () => {
    const persistence = makePersistence();

    repository.findOne.mockResolvedValue(persistence);

    await expect(typeOrmBrandRepository.findById('brand-id')).resolves.toEqual(
      new BrandEntity(persistence.id, persistence.name, persistence.createdBy),
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'brand-id' },
    });
  });

  it('should return null when brand is not found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      typeOrmBrandRepository.findById('brand-id'),
    ).resolves.toBeNull();
  });

  it('should find a brand by name', async () => {
    const persistence = makePersistence();

    repository.findOne.mockResolvedValue(persistence);

    await expect(
      typeOrmBrandRepository.findByName(persistence.name),
    ).resolves.toEqual(
      new BrandEntity(persistence.id, persistence.name, persistence.createdBy),
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { name: persistence.name },
    });
  });

  it('should return null when brand is not found by name', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      typeOrmBrandRepository.findByName('missing'),
    ).resolves.toBeNull();
  });

  it('should delete a brand by id', async () => {
    repository.delete.mockResolvedValue(undefined);

    await expect(
      typeOrmBrandRepository.delete('brand-id'),
    ).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('brand-id');
  });
});
