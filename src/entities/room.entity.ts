import {
  Column,
  Entity,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsOptional,
  IsString,
} from 'class-validator';

import { Base } from '@common';
import { BookingRoom } from '@entities';
import { Type } from 'class-transformer';

@Entity()
export class Room extends Base {
  @Column()
  @ApiProperty({ example: faker.person.fullName(), description: '' })
  @IsString()
  room_code: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.url(), description: '' })
  @IsString()
  @IsOptional()
  room_name: string;

  @OneToOne(() => BookingRoom, (booking) => booking.room)
  @Type(() => BookingRoom)
  readonly bookingRoom?: BookingRoom[];
  
}
