import { OmitType, PartialType, PickType } from '@nestjs/swagger';

import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
import { PostType } from '@entities';

export class CreatePostTypeRequestDto extends PickType(PostType, [
  'name',
  'slug',
  'coverUrl',
  'description',
] as const) {}
export class UpdatePostTypeRequestDto extends PickType(PostType, [
  'name',
  'slug',
  'coverUrl',
  'description',
] as const) {}

export class ArrayPostTypeResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: { [key: string]: PostType };
}
export class PostTypeDto extends PartialType(
  OmitType(PostType, ['isDeleted', 'createdAt', 'updatedAt', 'items'] as const),
) {}
export class PostTypeResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: PostTypeDto;
}
export class ListPostTypeResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: PostTypeDto[];
}
