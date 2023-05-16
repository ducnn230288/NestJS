import { applyDecorators, SerializeOptions, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ClassTransformOptions } from 'class-transformer';

import { AccessTokenGuard, PermissionGuard } from '@common';

export function Auth({
  summary,
  permission,
  serializeOptions = { groups: [] },
  tokenGuard = AccessTokenGuard,
}: {
  summary: string;
  permission?: string;
  serializeOptions?: ClassTransformOptions;
  tokenGuard?: any;
}): MethodDecorator {
  const _permissionGuard = tokenGuard === AccessTokenGuard ? PermissionGuard(permission) : tokenGuard;
  return applyDecorators(
    ApiOperation({ summary }),
    SerializeOptions(serializeOptions),
    UseGuards(tokenGuard, _permissionGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Error: Unauthorized' }),
    ApiForbiddenResponse({ description: 'Error: Forbidden' }),
  );
}
export const IS_PUBLIC_KEY = 'isPublic';
export function Public({
  summary,
  serializeOptions = {},
}: {
  summary: string;
  serializeOptions?: ClassTransformOptions;
}): MethodDecorator {
  SetMetadata(IS_PUBLIC_KEY, true);
  return applyDecorators(
    SerializeOptions(serializeOptions),
    ApiInternalServerErrorResponse({ description: 'Error: Internal Server Error' }),
    ApiOperation({ summary }),
  );
}
