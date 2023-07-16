import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
import { Post, PostTranslation } from '@entities';

export class CreatePostRequestDto extends PickType(Post, [
  'type',
  'thumbnailUrl',
  'coverUrl',
  'backGroundColor',
  'titleForeColor',
  'customCSSClass',
  'customCSS',
] as const) {
  @IsArray()
  translations: CreatePostTranslationRequestDto[];
}
export class CreatePostTranslationRequestDto extends PickType(PostTranslation, [
  'id',
  'language',
  'name',
  'description',
  'slug',
  'seoTitle',
  'seoDescription',
  'content',
] as const) {}

export class UpdatePostRequestDto extends PartialType(CreatePostRequestDto) {}

export class PostDto extends PartialType(
  OmitType(Post, ['isDeleted', 'createdAt', 'updatedAt', 'translations', 'item'] as const),
) {}
export class PostResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: PostDto;
}
export class ListPostResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: PostDto[];
}
