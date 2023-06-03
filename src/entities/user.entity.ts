import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsDateString,
  IsDecimal,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as argon2 from 'argon2';

import { Example, MaxGroup, OnlyUpdateGroup, Base } from '@common';
import { UserRole, Code } from '@entities';

@Entity()
// @Unique(['email', 'phoneNumber'])
export class User extends Base {
  @Column()
  @ApiProperty({ example: faker.name.fullName(), description: '' })
  @IsString()
  readonly name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.imageUrl(), description: '' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Column()
  @Expose({ groups: [OnlyUpdateGroup] })
  @ApiProperty({ example: Example.password, description: '' })
  @MinLength(6)
  @MaxLength(59)
  @IsOptional()
  password?: string;
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword?() {
    if (this.password && this.password.length < 60) {
      this.password = this.password && (await argon2.hash(this.password));
    }
  }

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;
  @BeforeUpdate()
  async hashRefreshToken?() {
    this.refreshToken = this.refreshToken && (await argon2.hash(this.refreshToken));
  }

  @Column({ nullable: true })
  @Exclude()
  resetPasswordToken?: string;

  @Column()
  @ApiProperty({ example: faker.internet.email().toLowerCase(), description: '' })
  @IsEmail()
  readonly email: string;

  @Column()
  @ApiProperty({ example: faker.phone.number('0#########'), description: '' })
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  readonly phoneNumber: string;

  @Column()
  @ApiProperty({ example: faker.date.birthdate(), description: '' })
  @IsDateString()
  dob: Date;

  @Column({ nullable: true })
  @Expose({ groups: [MaxGroup] })
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsString()
  @IsOptional()
  description: string;

  @Column({ nullable: true })
  @Expose({ groups: [MaxGroup] })
  @IsString()
  @IsOptional()
  roleCode?: string;

  @ManyToOne(() => UserRole, (role) => role.users, { eager: true }) //
  @JoinColumn({ name: 'roleCode', referencedColumnName: 'code' })
  @Type(() => UserRole)
  readonly role?: UserRole;

  @Column({ nullable: true })
  @Expose({ groups: [MaxGroup] })
  @ApiProperty({ example: 'DEV', description: '' })
  @IsString()
  @IsOptional()
  readonly positionCode?: string;

  @ManyToOne(() => Code)
  @JoinColumn({ name: 'positionCode', referencedColumnName: 'code' })
  readonly position?: Code;

  @Column()
  @ApiProperty({ example: faker.date.past(), description: '' })
  @IsDateString()
  startDate?: Date;

  @Column({ nullable: true, type: 'real' })
  @ApiProperty({ example: faker.datatype.number({ min: 0.5, max: 12 }), description: '' })
  @IsNumber()
  @IsOptional()
  dateLeave?: number;

  @Column({ nullable: true, type: 'real', default: 0 })
  @ApiProperty({ example: faker.datatype.number({ min: 0.5, max: 12 }), description: '' })
  @IsDecimal()
  readonly dateOff: number;
}
