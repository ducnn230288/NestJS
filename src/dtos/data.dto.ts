import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
import { Data, DataTranslation } from '@entities';

export class CreateDataRequestDto extends PickType(Data, [
  'type',
  'image',
  'name',
  'order',
  'createdAt',
  'isDisabled',
] as const) {
  @IsArray()
  @IsOptional()
  translations: CreateDataTranslationRequestDto[];
}
export class CreateDataTranslationRequestDto extends PickType(DataTranslation, [
  'id',
  'language',
  'name',
  'description',
  'position',
  'content',
] as const) {}

export class UpdateDataRequestDto extends PartialType(CreateDataRequestDto) {}

export class DataDto extends PartialType(
  OmitType(Data, ['isDeleted', 'createdAt', 'updatedAt', 'translations', 'item'] as const),
) {}
export class DataResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: DataDto;
}
export class ListDataResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: DataDto[];
}
