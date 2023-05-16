import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { Base } from '@common';
import { CodeType, User } from '@entities';

@Entity()
@Unique(['code'])
export class Code extends Base {
  @Column()
  @ApiProperty({ example: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }), description: '' })
  @IsString()
  code: string;

  @Column()
  @ApiProperty({ example: faker.random.alpha({ count: 3, casing: 'upper', bannedChars: ['A'] }), description: '' })
  @IsString()
  type: string;

  @Column()
  @ApiProperty({ example: faker.name.jobType(), description: '' })
  @IsString()
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsString()
  @IsOptional()
  description?: string;

  @ManyToOne(() => CodeType, (codeType) => codeType.items, { eager: false })
  @JoinColumn({ name: 'type', referencedColumnName: 'code' })
  public item?: CodeType;

  @OneToMany(() => User, (user) => user.position)
  @JoinColumn({ name: 'positionCode', referencedColumnName: 'code' })
  @Type(() => User)
  users?: User[];
}
