import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

import { Base } from '@common';
import { User } from '@entities';

@Entity()
export class UserTeam extends Base {
  @Column()
  @ApiProperty({ example: faker.name.jobType(), description: '' })
  @IsString()
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsString()
  @IsOptional()
  description: string;

  @ManyToOne(() => User, (user) => user.managers, { eager: true }) //
  @Type(() => User)
  manager: User;

  @Column({ nullable: true })
  @IsUUID()
  @IsOptional()
  managerId: string;

  @ManyToMany(() => User, (user) => user.teams)
  @Type(() => User)
  users?: User[];
}
