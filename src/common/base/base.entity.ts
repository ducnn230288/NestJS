import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

@Entity()
export abstract class Base<T extends Base = any> {
  constructor(partial: Partial<T> = {}) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @ApiProperty({ example: faker.string.uuid(), description: '' })
  id?: string;

  @DeleteDateColumn()
  @Exclude()
  isDeleted?: Date;

  @Column({ nullable: true })
  @IsDateString()
  @IsOptional()
  isDisabled?: Date;

  @CreateDateColumn({ name: 'created_at' })
  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt?: Date;
}
