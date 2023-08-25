import { OmitType, PartialType, PickType } from '@nestjs/swagger';

import { DefaultResponsesDto, PaginationResponsesDto, CodeTypeDto } from '@dtos';
import { Code } from '@entities';

export class CreateCodeRequestDto extends PickType(Code, ['code', 'type', 'name', 'description'] as const) {}
export class UpdateCodeRequestDto extends PartialType(CreateCodeRequestDto) {}

export class CodeDto extends PartialType(
  OmitType(Code, ['isDeleted', 'createdAt', 'updatedAt', 'users', 'item'] as const),
) {}
export class CodeResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: CodeDto;
}
export class ListCodeResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: CodeDto[];
}

export class CodeRelationshipDto extends PartialType(
  OmitType(Code, ['isDeleted', 'createdAt', 'updatedAt', 'users', 'item'] as const),
) {
  item?: CodeTypeDto;
}
export class CodeRelationshipResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: CodeRelationshipDto;
}
