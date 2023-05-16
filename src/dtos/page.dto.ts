import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
import { Page, PageTranslation } from '@entities';

export class CreatePageRequestDto extends PickType(Page, ['name', 'style', 'translations'] as const) {
  translations?: CreatePageTranslationRequestDto[];
}
export class CreatePageTranslationRequestDto extends PickType(PageTranslation, [
  'id',
  'language',
  'title',
  'slug',
  'seoDescription',
  'content',
] as const) {}
export class UpdatePageRequestDto extends PartialType(CreatePageRequestDto) {}

export class AllPageRequestDto {
  @IsArray()
  values: ItemPageRequestDto[];
}
export class ItemPageRequestDto extends PickType(Page, ['id', 'parentId', 'order'] as const) {
  @IsArray()
  parents: string[];

  @IsArray()
  children: ItemPageRequestDto[];
}

export class PageResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: PageDto;
}
export class PageTranslationDto extends PartialType(
  OmitType(PageTranslation, ['pageId', 'page', 'isDeleted'] as const),
) {}

export class PageDto extends PartialType(
  OmitType(Page, ['isDeleted', 'children', 'translations', 'createdAt', 'updatedAt'] as const),
) {
  readonly translations: PageTranslationDto[];
}

export class ListPageResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: ListPageDto[];
}
export class ListPageDto extends PartialType(OmitType(Page, ['isDeleted', 'children', 'translations'] as const)) {
  readonly translations: PageTranslationDto[];
}
