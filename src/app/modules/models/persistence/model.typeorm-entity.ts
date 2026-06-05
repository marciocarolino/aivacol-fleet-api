import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseTypeOrmEntity } from '../../../shared/persistence/base.typeorm-entity';

@Entity('models')
export class ModelTypeOrmEntity extends BaseTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    length: 255,
    unique: true,
  })
  name: string;
}
