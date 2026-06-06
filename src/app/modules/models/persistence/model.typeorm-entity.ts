import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseTypeOrmEntity } from '../../../shared/persistence/base.typeorm-entity';
import { BrandTypeOrmEntity } from '../../brands/persistence/brand.typeorm-entity';

@Entity('models')
export class ModelTypeOrmEntity extends BaseTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    length: 255,
    unique: true,
  })
  name: string;

  @Column({
    name: 'brand_id',
  })
  brandId: string;

  @ManyToOne(() => BrandTypeOrmEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'brand_id',
  })
  brand: BrandTypeOrmEntity;
}
