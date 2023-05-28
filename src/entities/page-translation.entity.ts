import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { faker } from '@faker-js/faker';

import { MaxGroup, Base } from '@common';
import { Page } from '@entities';

@Entity()
export class PageTranslation extends Base {
  @Column()
  @ApiProperty({ example: 'en', description: '' })
  @IsString()
  language: string;

  @Column()
  @ApiProperty({ example: faker.name.jobType(), description: '' })
  @IsString()
  title: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.lorem.slug(), description: '' })
  @IsString()
  @IsOptional()
  slug: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsString()
  @IsOptional()
  description?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  image?: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: [],
    nullable: false,
  })
  @Expose({ groups: [MaxGroup] })
  @ApiProperty({ example: [], description: '' })
  @IsOptional()
  readonly content?: Record<string, any>;

  @Column()
  @Expose({ groups: [MaxGroup] })
  @ApiProperty({ example: faker.datatype.uuid(), description: '' })
  @IsUUID()
  @IsOptional()
  pageId?: string;

  @ManyToOne(() => Page, (data) => data.translations, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Expose({ groups: [MaxGroup] })
  public page?: Page;
}
