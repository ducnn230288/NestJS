import { OmitType, PartialType, PickType } from '@nestjs/swagger';

import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
import { DataType } from '@entities';

export class CreateDataTypeRequestDto extends PickType(DataType, ['name', 'code'] as const) {}
export class UpdateDataTypeRequestDto extends PickType(DataType, ['name'] as const) {}

export class ArrayDataTypeResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: { [key: string]: DataType };
}
export class DataTypeDto extends PartialType(
  OmitType(DataType, ['isDeleted', 'createdAt', 'updatedAt', 'items'] as const),
) {}
export class DataTypeResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: DataTypeDto;
}
export class ListDataTypeResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: DataTypeDto[];
}
