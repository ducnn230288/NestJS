import { OmitType, PartialType } from '@nestjs/swagger';

import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
import { Error } from '@entities';

export class ErrorDto extends PartialType(OmitType(Error, ['isDeleted', 'createdAt', 'updatedAt'] as const)) {}
export class ErrorResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: ErrorDto;
}
export class ListErrorResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: ErrorDto[];
}
