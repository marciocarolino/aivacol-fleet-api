import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseTypeOrmEntity {
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    name: 'created_by',
    length: 255,
  })
  createdBy: string;
}
