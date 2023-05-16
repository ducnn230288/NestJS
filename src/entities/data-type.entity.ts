import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsBoolean, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

import { RelationGroup, Base } from '@common';

import { Data } from './data.entity';

@Entity()
@Unique(['code'])
export class DataType extends Base {
  @Column()
  @ApiProperty({ example: faker.name.jobType(), description: '' })
  @Expose()
  @IsString()
  name: string;

  @Column()
  @Expose()
  @ApiProperty({ example: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }), description: '' })
  @IsString()
  code: string;

  @Column({ default: false })
  @Expose()
  @ApiProperty({ example: false, description: '' })
  @IsBoolean()
  isPrimary: boolean;

  @OneToMany(() => Data, (data) => data.item, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Expose({ groups: [RelationGroup] })
  items?: Data[];
}
