import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Expose } from 'class-transformer';

import { MaxGroup, Base } from '@common';
import { PageTranslation } from '@entities';

@Entity()
export class Page extends Base {
  @Column()
  @ApiProperty({ example: faker.name.jobType(), description: '' })
  @IsString()
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'style1', description: '' })
  @IsString()
  @IsOptional()
  style: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.datatype.number({ min: 0 }), description: '' })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @Column({ nullable: true })
  @Expose({ groups: [MaxGroup] })
  @ApiProperty({ example: null, description: '' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ManyToOne(() => Page, (page) => page.children, { eager: true })
  @Expose({ groups: [MaxGroup] })
  @IsArray()
  @IsOptional()
  parent?: Page;

  @OneToMany(() => Page, (page) => page.parent)
  @IsArray()
  @IsOptional()
  children?: Page[];

  @OneToMany(() => PageTranslation, (data) => data.page, { eager: true })
  @Expose({ groups: [MaxGroup] })
  @IsArray()
  translations?: PageTranslation[];
}
