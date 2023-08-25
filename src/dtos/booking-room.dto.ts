import { PickType } from '@nestjs/swagger';
import { BookingRoom } from '@entities';

export class CreateBookingRoomRequestDto extends PickType(BookingRoom, [
  'bookDate',
  'startTime',
  'endTime',
  'description',
  'meetingName',
  'userId',
  'roomId',
] as const) {}
