import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseTypeOrmEntity } from '../../../shared/persistence/base.typeorm-entity';
import { ModelTypeOrmEntity } from '../../models/persistence/model.typeorm-entity';

@Entity('vehicles')
export class VehicleTypeOrmEntity extends BaseTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    name: 'license_plate',
    length: 20,
    unique: true,
  })
  licensePlate: string;

  @Column({
    length: 255,
  })
  chassis: string;

  @Column({
    length: 255,
  })
  renavam: string;

  @Column()
  year: number;

  @Column({
    name: 'model_id',
  })
  modelId: string;

  @ManyToOne(() => ModelTypeOrmEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'model_id',
  })
  model: ModelTypeOrmEntity;
}
