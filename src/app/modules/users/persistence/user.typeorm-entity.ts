import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseTypeOrmEntity } from '../../../shared/persistence/base.typeorm-entity';

@Entity('users')
export class UserTypeOrmEntity extends BaseTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nickname: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({
    length: 255,
  })
  password: string;
}
