import { Body, Post} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, MaxGroup, OnlyUpdateGroup, SerializerBody } from '@common';
import { BookingRoomService, P_BOOKING_ROOM } from 'src/services/booking-room.service';
import { CreateBookingRoomRequestDto } from 'src/dtos/booking-room.dto';

@Headers('booking-room')
export class BookingRoomController {
  constructor(private readonly service: BookingRoomService) {}

  @Auth({
    summary: 'Create new booking room',
    permission: P_BOOKING_ROOM,
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([MaxGroup, OnlyUpdateGroup])) dataRequest: CreateBookingRoomRequestDto,
  ): Promise<any> {
    const data = await this.service.create(dataRequest, i18n);
    return {
      message: i18n.t('common.Create Success'),
      data: data,
    };
  }
}
