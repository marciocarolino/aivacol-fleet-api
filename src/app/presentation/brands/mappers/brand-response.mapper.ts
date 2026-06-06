import { BrandEntity } from '../../../domain/brands/entities/brand.entity';

import { BrandResponse } from '../responses/brand.response';

export class BrandResponseMapper {
  static toResponse(brand: BrandEntity): BrandResponse {
    return {
      id: brand.id,
      name: brand.name,
    };
  }
}
