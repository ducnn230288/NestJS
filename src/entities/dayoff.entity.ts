import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsString, IsInt, IsDateString, Min, Max, IsDecimal, IsOptional, IsUUID } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

import { MaxGroup, Base } from '@common';
import { User } from '@entities';

@Entity()
export class DayOff extends Base {
  @Column()
  @ApiProperty({ example: '230715000001', description: '' })
  @IsString()
  @IsOptional()
  code: string;

  @Column()
  @ApiProperty({ example: faker.number.int({ min: 1, max: 3 }), description: '' })
  @IsInt()
  @Min(1)
  @Max(3)
  type: number;

  @Column({ default: 0 })
  @ApiProperty({ example: faker.number.int({ min: -1, max: 1 }), description: '' })
  @IsInt()
  @Min(-1)
  @Max(1)
  status: number;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  reason: string;

  @Column()
  @ApiProperty({ example: faker.number.int({ min: 0, max: 2 }), description: '' })
  @IsInt()
  @Min(0)
  @Max(2)
  time: number;

  @Column({ nullable: true, type: 'real' })
  @ApiProperty({ example: faker.number.int({ min: 0.5, max: 1 }), description: '' })
  @IsDecimal()
  @Min(0.5)
  @Max(1)
  @IsOptional()
  timeNumber: number;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.url(), description: '' })
  @IsString()
  @IsOptional()
  image: string;

  @Column()
  @ApiProperty({ example: faker.date.soon({ days: 1 }), description: '' })
  @IsDateString()
  dateLeaveStart: Date;

  @Column()
  @ApiProperty({ example: faker.date.soon({ days: 10 }), description: '' })
  @IsDateString()
  dateLeaveEnd: Date;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.date.soon({ days: 10 }), description: '' })
  @IsDateString()
  approvedAt: Date;

  @Column({ nullable: true })
  @Expose({ groups: [MaxGroup] })
  @IsUUID()
  approvedById: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'approvedById', referencedColumnName: 'id' })
  @Type(() => User)
  @Expose({ groups: [MaxGroup] })
  approvedBy: User;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  reasonReject: string;

  @Column()
  @Expose({ groups: [MaxGroup] })
  @IsUUID()
  @IsOptional()
  staffId: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'staffId', referencedColumnName: 'id' })
  @Type(() => User)
  @Expose({ groups: [MaxGroup] })
  staff: User;

  @Column({ nullable: true })
  @Expose({ groups: [MaxGroup] })
  @IsOptional()
  @IsUUID()
  managerId?: string;

  @ManyToOne(() => User, (user) => user.members, { eager: true })
  @Type(() => User)
  @Expose({ groups: [MaxGroup] })
  readonly manager?: User;
}
