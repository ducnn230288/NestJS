import { OmitType, PartialType, PickType } from '@nestjs/swagger';

import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
import { UserRole } from '@entities';

export class CreateUserRoleRequestDto extends PickType(UserRole, [
  'name',
  'code',
  'isSystemAdmin',
  'permissions',
] as const) {}

export class UpdateUserRoleRequestDto extends PartialType(CreateUserRoleRequestDto) {}

export class ListUserRoleResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: UserRoleDto[];
}
export class UserRoleDto extends PartialType(
  OmitType(UserRole, ['isDeleted', 'createdAt', 'updatedAt', 'users'] as const),
) {}

export class PermissionResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: string[];
}

export class UserRoleResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: UserRole;
}
