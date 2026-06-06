import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';
import { BrandResponseMapper } from '../../../../src/app/presentation/brands/mappers/brand-response.mapper';

describe('BrandResponseMapper', () => {
  it('should map brand domain entity to response', () => {
    const brand = new BrandEntity('brand-id', 'Mercedes-Benz', 'system');

    expect(BrandResponseMapper.toResponse(brand)).toEqual({
      id: brand.id,
      name: brand.name,
    });
  });
});
