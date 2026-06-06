import { BrandResponse } from '../../../../src/app/presentation/brands/responses/brand.response';

describe('BrandResponse', () => {
  it('should create response with assigned values', () => {
    const response = new BrandResponse();

    response.id = 'brand-id';
    response.name = 'Mercedes-Benz';

    expect(response).toEqual({
      id: 'brand-id',
      name: 'Mercedes-Benz',
    });
  });
});
