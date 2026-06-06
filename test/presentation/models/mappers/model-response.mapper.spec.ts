import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';
import { ModelResponseMapper } from '../../../../src/app/presentation/models/mappers/model-response.mapper';

describe('ModelResponseMapper', () => {
  it('should map model domain entity to response', () => {
    const model = new ModelEntity('model-id', 'Sprinter', 'brand-id', 'system');

    expect(ModelResponseMapper.toResponse(model)).toEqual({
      id: model.id,
      name: model.name,
      brandId: model.brandId,
    });
  });
});
