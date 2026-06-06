import { BrandEntity } from '../entities/brand.entity';

export interface BrandRepository {
  save(brand: BrandEntity): Promise<BrandEntity>;

  findById(id: string): Promise<BrandEntity | null>;

  findByName(name: string): Promise<BrandEntity | null>;

  delete(id: string): Promise<void>;
}
