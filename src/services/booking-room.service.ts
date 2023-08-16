import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

import { BaseService } from '@common';
import { CreateBookingRoomRequestDto } from 'src/dtos/booking-room.dto';
import { BookingRoom } from '../entities/booking-room.entity';

export const P_BOOKING_ROOM = '872f4ae3-d62a-46a8-89e4-cf947a713d6f';

@Injectable()
export class BookingRoomService extends BaseService {
  constructor(
    @InjectRepository(BookingRoom)
    public repo: Repository<BookingRoom>,
  ) {
    super(repo);
  }

  /**
   * 
   * @param bookingRoomReqest 
   * @param i18n 
   * @returns {statusCode, message, data}
   * 
   */
  async create(bookingRoomReqest: CreateBookingRoomRequestDto, i18n: I18nContext) {

    const bookingRoom = this.repo.create(bookingRoomReqest);
    return await this.repo.save(bookingRoom);
  }
}
