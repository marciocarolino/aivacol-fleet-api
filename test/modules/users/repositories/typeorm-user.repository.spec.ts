import { UserEntity } from '../../../../src/app/domain/users/entities/user.entity';
import { TypeOrmUserRepository } from '../../../../src/app/modules/users/repositories/typeorm-user.repository';
import { UserTypeOrmEntity } from '../../../../src/app/modules/users/persistence/user.typeorm-entity';

describe('TypeOrmUserRepository', () => {
  const repository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  let typeOrmUserRepository: TypeOrmUserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    typeOrmUserRepository = new TypeOrmUserRepository(repository as never);
  });

  function makePersistence(): UserTypeOrmEntity {
    const persistence = new UserTypeOrmEntity();
    persistence.id = 'user-id';
    persistence.nickname = 'marcio';
    persistence.name = 'Marcio';
    persistence.email = 'marcio@email.com';
    persistence.password = 'hash';
    persistence.createdBy = 'creator@email.com';

    return persistence;
  }

  it('should save a user using TypeORM repository', async () => {
    const user = new UserEntity(
      'user-id',
      'marcio',
      'Marcio',
      'marcio@email.com',
      'hash',
      'creator@email.com',
    );
    const persistence = makePersistence();

    repository.save.mockResolvedValue(persistence);

    await expect(typeOrmUserRepository.save(user)).resolves.toEqual(user);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining(persistence),
    );
  });

  it('should find a user by id', async () => {
    const persistence = makePersistence();

    repository.findOne.mockResolvedValue(persistence);

    await expect(typeOrmUserRepository.findById('user-id')).resolves.toEqual(
      new UserEntity(
        persistence.id,
        persistence.nickname,
        persistence.name,
        persistence.email,
        persistence.password,
        persistence.createdBy,
      ),
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'user-id' },
    });
  });

  it('should return null when user is not found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(typeOrmUserRepository.findById('user-id')).resolves.toBeNull();
  });

  it('should find a user by email', async () => {
    const persistence = makePersistence();

    repository.findOne.mockResolvedValue(persistence);

    await expect(
      typeOrmUserRepository.findByEmail(persistence.email),
    ).resolves.toEqual(
      new UserEntity(
        persistence.id,
        persistence.nickname,
        persistence.name,
        persistence.email,
        persistence.password,
        persistence.createdBy,
      ),
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: persistence.email },
    });
  });

  it('should return null when user is not found by email', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      typeOrmUserRepository.findByEmail('missing@email.com'),
    ).resolves.toBeNull();
  });

  it('should delete a user by id', async () => {
    repository.delete.mockResolvedValue(undefined);

    await expect(
      typeOrmUserRepository.delete('user-id'),
    ).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('user-id');
  });
});
