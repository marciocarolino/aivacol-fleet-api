import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';

describe('ModelEntity', () => {
  it('should create a model entity with provided values', () => {
    const model = new ModelEntity('model-id', 'Sprinter', 'brand-id', 'system');

    expect(model).toEqual({
      id: 'model-id',
      name: 'Sprinter',
      brandId: 'brand-id',
      createdBy: 'system',
    });
  });
});
