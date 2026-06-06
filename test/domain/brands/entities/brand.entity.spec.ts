import { BrandEntity } from '../../../../src/app/domain/brands/entities/brand.entity';

describe('BrandEntity', () => {
  it('should create a brand entity with provided values', () => {
    const brand = new BrandEntity('brand-id', 'Mercedes-Benz', 'system');

    expect(brand).toEqual({
      id: 'brand-id',
      name: 'Mercedes-Benz',
      createdBy: 'system',
    });
  });
});
