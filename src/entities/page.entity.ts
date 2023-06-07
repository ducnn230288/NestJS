import { Column, Entity, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Expose } from 'class-transformer';

import { MaxGroup, Base } from '@common';
import { PageTranslation } from '@entities';

@Entity()
@Tree('materialized-path')
export class Page extends Base {
  @Column()
  @ApiProperty({ example: faker.name.jobType(), description: '' })
  @IsString()
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'type1', description: '' })
  @IsString()
  @IsOptional()
  type: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.datatype.number({ min: 0 }), description: '' })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @Column({ nullable: true })
  parentId?: string;

  @TreeParent()
  @Expose({ groups: [MaxGroup] })
  @IsOptional()
  parent?: Page;

  @TreeChildren()
  @IsArray()
  @IsOptional()
  children?: Page[];

  @OneToMany(() => PageTranslation, (data) => data.page, { eager: true })
  @Expose({ groups: [MaxGroup] })
  @IsArray()
  translations?: PageTranslation[];
}
