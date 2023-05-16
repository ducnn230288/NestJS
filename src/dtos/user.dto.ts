import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';

import { Example } from '@common';
import { DefaultResponsesDto, PaginationResponsesDto, CodeDto, UserRoleDto } from '@dtos';
import { User } from '@entities';

export class LoginAuthRequestDto extends PickType(User, ['email', 'password'] as const) {}
export class RegisterAuthRequestDto extends PickType(User, [
  'name',
  'password',
  'email',
  'phoneNumber',
  'dob',
  'description',
  'startDate',
] as const) {
  @MinLength(6)
  @ApiProperty({ example: Example.password, description: '' })
  readonly retypedPassword: string;
}
export class ProfileAuthRequestDto extends PickType(User, [
  'name',
  'password',
  'email',
  'phoneNumber',
  'dob',
  'positionCode',
  'description',
  'avatar',
] as const) {
  @ApiProperty({ example: Example.password, description: '' })
  @IsString()
  @IsOptional()
  retypedPassword: string;
}
export class ForgottenPasswordAuthRequestDto extends PickType(User, ['email'] as const) {}
export class RestPasswordAuthRequestDto extends PickType(User, ['password'] as const) {
  @MinLength(6)
  @ApiProperty({ example: Example.password, description: '' })
  readonly retypedPassword: string;
}

export class DefaultAuthResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: AuthDto;
}

export class AuthDto {
  user: DefaultAuthResponsesUserDto;

  @ApiProperty({ example: Example.token, description: '' })
  readonly accessToken: string;

  @ApiProperty({ example: Example.token, description: '' })
  readonly refreshToken: string;
}
export class DefaultAuthResponsesUserDto extends PartialType(
  OmitType(User, ['password', 'position', 'role'] as const),
) {
  readonly position: CodeDto;
  readonly role: UserRoleDto;
}
export class ProfileAuthResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: DefaultAuthResponsesUserDto;
}

export class CreateUserRequestDto extends PickType(User, [
  'password',
  'name',
  'email',
  'phoneNumber',
  'dob',
  'startDate',
  'positionCode',
  'teams',
  'description',
  'avatar',
  'dateLeave',
  'roleCode',
  'managerId',
] as const) {
  @MinLength(6)
  @ApiProperty({ example: Example.password, description: '' })
  retypedPassword: string;
}

export class UpdateUserRequestDto extends PickType(User, [
  'name',
  'email',
  'phoneNumber',
  'dob',
  'startDate',
  'positionCode',
  'teams',
  'description',
  'avatar',
  'dateLeave',
  'roleCode',
  'managerId',
] as const) {}

export class ListUserResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: UserDto[];
}
export class UserDto extends PartialType(
  OmitType(User, ['isDeleted', 'createdAt', 'updatedAt', 'password', 'position', 'role'] as const),
) {
  readonly position: CodeDto;
  readonly role: UserRoleDto;
}

export class UserResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: DefaultAuthResponsesUserDto;
}
