import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Expose } from 'class-transformer';

import { MaxGroup, Base } from '@common';
import { DataType, DataTranslation } from '@entities';

@Entity()
export class Data extends Base {
  @Column()
  @ApiProperty({ example: faker.string.alpha({ length: 3, casing: 'upper', exclude: ['A'] }), description: '' })
  @IsString()
  type: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.url(), description: '' })
  @IsString()
  @IsOptional()
  name?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.url(), description: '' })
  @IsString()
  @IsOptional()
  image?: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.number.int({ min: 0 }), description: '' })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ManyToOne(() => DataType, (dataType) => dataType.items, { eager: false })
  @JoinColumn({ name: 'type', referencedColumnName: 'code' })
  @Expose({ groups: [MaxGroup] })
  public item?: DataType;

  @OneToMany(() => DataTranslation, (data) => data.data, { eager: true })
  @IsArray()
  public translations?: DataTranslation[];
}
