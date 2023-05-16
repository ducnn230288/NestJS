import { OmitType, PartialType, PickType } from '@nestjs/swagger';

import { DefaultResponsesDto, PaginationResponsesDto, CodeDto } from '@dtos';
import { CodeType } from '@entities';

export class CreateCodeTypeRequestDto extends PickType(CodeType, ['name', 'code'] as const) {}
export class UpdateCodeTypeRequestDto extends PickType(CodeType, ['name'] as const) {}

export class CodeTypeDto extends PartialType(
  OmitType(CodeType, ['isDeleted', 'createdAt', 'updatedAt', 'items'] as const),
) {}
export class CodeTypeResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: CodeTypeDto;
}
export class ListCodeTypeResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: CodeTypeDto[];
}

export class CodeTypeRelationshipDto extends PartialType(
  OmitType(CodeType, ['isDeleted', 'createdAt', 'updatedAt', 'items'] as const),
) {
  readonly items: CodeDto[];
}
export class CodeTypeRelationshipResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: CodeTypeRelationshipDto;
}
