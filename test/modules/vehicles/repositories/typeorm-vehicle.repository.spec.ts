/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';
import { VehicleTypeOrmEntity } from '../../../../src/app/modules/vehicles/persistence/vehicle.typeorm-entity';
import { TypeOrmVehicleRepository } from '../../../../src/app/modules/vehicles/repositories/typeorm-vehicle.repository';

describe('TypeOrmVehicleRepository', () => {
  const repository = {
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

  let typeOrmVehicleRepository: TypeOrmVehicleRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    typeOrmVehicleRepository = new TypeOrmVehicleRepository(
      repository as never,
    );
  });

  function makePersistence(): VehicleTypeOrmEntity {
    return Object.assign(new VehicleTypeOrmEntity(), {
      id: 'vehicle-id',
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
      createdBy: 'system',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    });
  }

  it('should save a vehicle using TypeORM repository', async () => {
    const persistence = makePersistence();
    const vehicle = Object.assign(new VehicleEntity(), persistence);

    repository.save.mockResolvedValue(persistence);

    await expect(typeOrmVehicleRepository.save(vehicle)).resolves.toEqual(
      expect.objectContaining({
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        chassis: vehicle.chassis,
        renavam: vehicle.renavam,
        year: vehicle.year,
        modelId: vehicle.modelId,
        createdBy: vehicle.createdBy,
      }),
    );
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        chassis: vehicle.chassis,
        renavam: vehicle.renavam,
        year: vehicle.year,
        modelId: vehicle.modelId,
        createdBy: vehicle.createdBy,
      }),
    );
  });

  it('should find a vehicle by id', async () => {
    const persistence = makePersistence();

    repository.findOne.mockResolvedValue(persistence);

    await expect(
      typeOrmVehicleRepository.findById('vehicle-id'),
    ).resolves.toEqual(expect.objectContaining({ id: 'vehicle-id' }));
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'vehicle-id' },
    });
  });

  it('should find all vehicles with pagination and combined filters', async () => {
    const persistence = makePersistence();

    repository.findAndCount.mockResolvedValue([[persistence], 1]);

    await expect(
      typeOrmVehicleRepository.findAll({
        page: 2,
        limit: 5,
        filters: {
          licensePlate: 'ABC',
          chassis: 'chassis',
          renavam: 'renavam',
          year: 2024,
          modelId: 'model-id',
        },
      }),
    ).resolves.toEqual({
      items: [expect.objectContaining({ id: 'vehicle-id' })],
      total: 1,
    });
    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {
        licensePlate: expect.objectContaining({
          _value: '%ABC%',
        }),
        chassis: expect.objectContaining({
          _value: '%chassis%',
        }),
        renavam: expect.objectContaining({
          _value: '%renavam%',
        }),
        year: 2024,
        modelId: 'model-id',
      },
      skip: 5,
      take: 5,
      order: {
        createdAt: 'DESC',
      },
    });
  });

  it('should find all vehicles without filters', async () => {
    repository.findAndCount.mockResolvedValue([[], 0]);

    await expect(
      typeOrmVehicleRepository.findAll({
        page: 1,
        limit: 10,
        filters: {},
      }),
    ).resolves.toEqual({
      items: [],
      total: 0,
    });
    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 10,
      order: {
        createdAt: 'DESC',
      },
    });
  });

  it('should return null when vehicle is not found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      typeOrmVehicleRepository.findById('vehicle-id'),
    ).resolves.toBeNull();
  });

  it('should find a vehicle by license plate', async () => {
    const persistence = makePersistence();

    repository.findOne.mockResolvedValue(persistence);

    await expect(
      typeOrmVehicleRepository.findByLicensePlate('ABC1234'),
    ).resolves.toEqual(expect.objectContaining({ licensePlate: 'ABC1234' }));
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { licensePlate: 'ABC1234' },
    });
  });

  it('should return null when vehicle is not found by license plate', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      typeOrmVehicleRepository.findByLicensePlate('ABC1234'),
    ).resolves.toBeNull();
  });

  it('should return true when vehicle exists by model id', async () => {
    repository.count.mockResolvedValue(1);

    await expect(
      typeOrmVehicleRepository.existsByModelId('model-id'),
    ).resolves.toBe(true);
    expect(repository.count).toHaveBeenCalledWith({
      where: { modelId: 'model-id' },
    });
  });

  it('should return false when vehicle does not exist by model id', async () => {
    repository.count.mockResolvedValue(0);

    await expect(
      typeOrmVehicleRepository.existsByModelId('model-id'),
    ).resolves.toBe(false);
  });

  it('should delete a vehicle by id', async () => {
    await expect(
      typeOrmVehicleRepository.delete('vehicle-id'),
    ).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('vehicle-id');
  });
});
