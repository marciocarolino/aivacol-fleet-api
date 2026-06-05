import { RedisCacheService } from '../../../../src/app/modules/cache/services/redis-cache.service';

describe('RedisCacheService', () => {
  const cacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  let service: RedisCacheService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RedisCacheService(cacheManager as never);
  });

  it('should return cached value when it exists', async () => {
    cacheManager.get.mockResolvedValue({ id: 'cached-id' });

    await expect(service.get('cache-key')).resolves.toEqual({
      id: 'cached-id',
    });
  });

  it('should return null when cached value is undefined', async () => {
    cacheManager.get.mockResolvedValue(undefined);

    await expect(service.get('cache-key')).resolves.toBeNull();
  });

  it('should set value without ttl', async () => {
    await service.set('cache-key', { id: 'value-id' });

    expect(cacheManager.set).toHaveBeenCalledWith('cache-key', {
      id: 'value-id',
    });
  });

  it('should set value with ttl', async () => {
    await service.set('cache-key', { id: 'value-id' }, 60);

    expect(cacheManager.set).toHaveBeenCalledWith(
      'cache-key',
      { id: 'value-id' },
      60,
    );
  });

  it('should delete value by key', async () => {
    await service.delete('cache-key');

    expect(cacheManager.del).toHaveBeenCalledWith('cache-key');
  });
});
