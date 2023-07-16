import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Expose } from 'class-transformer';

import { MaxGroup, Base } from '@common';
import { PostType, PostTranslation } from '@entities';

@Entity()
export class Post extends Base {
  @Column()
  @ApiProperty({ example: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }), description: '' })
  @IsString()
  type: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  coverUrl?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  backGroundColor?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  titleForeColor?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  customCSSClass?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  customCSS?: string;

  @ManyToOne(() => PostType, (dataType) => dataType.items, { eager: false })
  @JoinColumn({ name: 'type', referencedColumnName: 'slug' })
  @Expose({ groups: [MaxGroup] })
  public item?: PostType;

  @OneToMany(() => PostTranslation, (data) => data.post, { eager: true })
  @Expose({ groups: [MaxGroup] })
  @IsArray()
  public translations?: PostTranslation[];
}
