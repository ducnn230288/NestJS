import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

import { MaxGroup, Base } from '@common';
import { Data } from '@entities';

@Entity()
export class DataTranslation extends Base {
  @Column()
  @ApiProperty({ example: 'en', description: '' })
  @IsString()
  language: string;

  @Column()
  @ApiProperty({ example: faker.name.jobType(), description: '' })
  @IsString()
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsString()
  @IsOptional()
  description?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsString()
  @IsOptional()
  position?: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: {},
  })
  @Expose({ groups: [MaxGroup] })
  @ApiProperty({ example: [], description: '' })
  @IsOptional()
  readonly content?: Record<string, any>;

  @Column()
  @Expose({ groups: [MaxGroup] })
  @IsUUID()
  @IsOptional()
  dataId?: string;

  @ManyToOne(() => Data, (data) => data.translations, { eager: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  public data?: Data;
}
