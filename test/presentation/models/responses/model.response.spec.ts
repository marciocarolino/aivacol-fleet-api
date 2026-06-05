import { ModelResponse } from '../../../../src/app/presentation/Models/responses/model.response';

describe('ModelResponse', () => {
  it('should create response with assigned values', () => {
    const response = new ModelResponse();

    response.id = 'model-id';
    response.name = 'Sprinter';

    expect(response).toEqual({
      id: 'model-id',
      name: 'Sprinter',
    });
  });
});
