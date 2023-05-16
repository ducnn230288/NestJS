import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
import { Data, DataTranslation } from '@entities';

export class CreateDataRequestDto extends PickType(Data, [
  'type',
  'image',
  'image1',
  'image2',
  'image3',
  'order',
  'createdAt',
] as const) {
  @IsArray()
  translations: CreateDataTranslationRequestDto[];
}
export class CreateDataTranslationRequestDto extends PickType(DataTranslation, [
  'id',
  'language',
  'name',
  'description',
  'slug',
  'seoTitle',
  'seoDescription',
  'text1',
  'text2',
  'text3',
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
