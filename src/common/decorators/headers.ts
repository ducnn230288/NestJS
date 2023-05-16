import { applyDecorators, ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

export function Headers(name: string) {
  return applyDecorators(
    Controller('/api/' + name),
    ApiTags(name),
    ApiHeader({ name: 'Accept-Language' }),
    UseInterceptors(ClassSerializerInterceptor),
  );
}
