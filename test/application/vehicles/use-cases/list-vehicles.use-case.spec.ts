import { ListVehiclesUseCase } from '../../../../src/app/application/vehicles/use-cases/list-vehicles.use-case';
import { VehicleEntity } from '../../../../src/app/domain/vehicles/entities/vehicle.entity';

describe('ListVehiclesUseCase', () => {
  const vehicleRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByLicensePlate: jest.fn(),
    existsByModelId: jest.fn(),
    delete: jest.fn(),
  };
  const redisCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: ListVehiclesUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListVehiclesUseCase(
      vehicleRepository,
      redisCacheService as never,
    );
  });

  it('should return cached paginated vehicles when cache exists for query', async () => {
    const cachedOutput = {
      items: [new VehicleEntity()],
      total: 1,
      page: 2,
      limit: 5,
    };
    const cacheItemKey = JSON.stringify({
      page: 2,
      limit: 5,
      filters: {
        licensePlate: 'ABC',
        chassis: undefined,
        renavam: '123',
        year: 2024,
        modelId: undefined,
      },
    });

    redisCacheService.get.mockResolvedValue({
      [cacheItemKey]: cachedOutput,
    });

    await expect(
      useCase.execute({
        page: 2,
        limit: 5,
        licensePlate: 'ABC',
        renavam: '123',
        year: 2024,
      }),
    ).resolves.toBe(cachedOutput);
    expect(vehicleRepository.findAll).not.toHaveBeenCalled();
  });

  it('should list vehicles using defaults and cache result when cache is empty', async () => {
    const vehicle = new VehicleEntity();

    redisCacheService.get.mockResolvedValue(null);
    vehicleRepository.findAll.mockResolvedValue({
      items: [vehicle],
      total: 1,
    });

    await expect(useCase.execute({})).resolves.toEqual({
      items: [vehicle],
      total: 1,
      page: 1,
      limit: 10,
    });
    expect(vehicleRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      filters: {
        licensePlate: undefined,
        chassis: undefined,
        renavam: undefined,
        year: undefined,
        modelId: undefined,
      },
    });
    expect(redisCacheService.set).toHaveBeenCalledWith(
      'vehicles:list',
      expect.any(Object),
    );
  });

  it('should list vehicles with combined filters and preserve cached entries', async () => {
    const vehicle = new VehicleEntity();

    redisCacheService.get.mockResolvedValue({
      previous: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      },
    });
    vehicleRepository.findAll.mockResolvedValue({
      items: [vehicle],
      total: 1,
    });

    await expect(
      useCase.execute({
        page: 3,
        limit: 20,
        licensePlate: 'ABC',
        chassis: 'chassis',
        renavam: 'renavam',
        year: 2025,
        modelId: 'model-id',
      }),
    ).resolves.toEqual({
      items: [vehicle],
      total: 1,
      page: 3,
      limit: 20,
    });
    expect(vehicleRepository.findAll).toHaveBeenCalledWith({
      page: 3,
      limit: 20,
      filters: {
        licensePlate: 'ABC',
        chassis: 'chassis',
        renavam: 'renavam',
        year: 2025,
        modelId: 'model-id',
      },
    });
    expect(redisCacheService.set).toHaveBeenCalledWith(
      'vehicles:list',
      expect.objectContaining({
        previous: {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
        },
      }),
    );
  });
});
