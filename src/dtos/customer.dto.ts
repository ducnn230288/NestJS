import { PickType, PartialType } from '@nestjs/swagger';
import { PaginationResponsesDto, DefaultResponsesDto } from '@dtos';
import { Customer } from '@entities';

export class CreateClientCustomerRequestDto extends PickType(Customer, [
  'name',
  'email',
  'phoneNumber',
  'message',
] as const) {}

export class CreateCustomerRequestDto extends PickType(Customer, [
  'name',
  'email',
  'phoneNumber',
  'message',
  'note',
] as const) {}
export class UpdateCustomerRequestDto extends PickType(Customer, [
  'name',
  'email',
  'phoneNumber',
  'message',
  'note',
] as const) {}
export class CustomerResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: Customer;
}
export class ListCustomerResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: Customer[];
}
