import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

import { MaxGroup, Base } from '@common';
import { Post } from '@entities';

@Entity()
@Unique(['code'])
export class PostType extends Base {
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

  @Column()
  @Expose()
  @ApiProperty({ example: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }), description: '' })
  @IsString()
  slug: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  coverUrl?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsString()
  @IsOptional()
  description?: string;

  @Column({ default: false })
  @Expose()
  @ApiProperty({ example: false, description: '' })
  @IsBoolean()
  isPrimary: boolean;

  @OneToMany(() => Post, (data) => data.item, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @Expose({ groups: [MaxGroup] })
  items?: Post[];
}
