import { ModelEntity } from '../entities/model.entity';

export interface ModelRepository {
  save(model: ModelEntity): Promise<ModelEntity>;

  findById(id: string): Promise<ModelEntity | null>;

  findByName(name: string): Promise<ModelEntity | null>;

  existsByBrandId(brandId: string): Promise<boolean>;

  delete(id: string): Promise<void>;
}
