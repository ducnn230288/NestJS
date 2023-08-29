import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsOptional, IsString } from 'class-validator';

import { Base } from '@common';

@Entity()
export class Error extends Base {
  @Column()
  @ApiProperty({ example: faker.person.jobType(), description: '' })
  @IsString()
  name: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: {},
  })
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsOptional()
  stack?: string;
}
