import { ModelEntity } from '../../../domain/models/entities/model.entity';

import { ModelResponse } from '../responses/model.response';

export class ModelResponseMapper {
  static toResponse(model: ModelEntity): ModelResponse {
    return {
      id: model.id,
      name: model.name,
      brandId: model.brandId,
    };
  }
}
