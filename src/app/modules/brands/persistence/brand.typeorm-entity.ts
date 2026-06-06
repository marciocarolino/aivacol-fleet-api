import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseTypeOrmEntity } from '../../../shared/persistence/base.typeorm-entity';

@Entity('brands')
export class BrandTypeOrmEntity extends BaseTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    length: 255,
    unique: true,
  })
  name: string;
}
