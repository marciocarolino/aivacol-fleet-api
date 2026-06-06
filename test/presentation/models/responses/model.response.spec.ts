import { ModelResponse } from '../../../../src/app/presentation/models/responses/model.response';

describe('ModelResponse', () => {
  it('should create response with assigned values', () => {
    const response = new ModelResponse();

    response.id = 'model-id';
    response.name = 'Sprinter';
    response.brandId = 'brand-id';

    expect(response).toEqual({
      id: 'model-id',
      name: 'Sprinter',
      brandId: 'brand-id',
    });
  });
});
