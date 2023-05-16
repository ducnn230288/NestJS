import { PickType, PartialType } from '@nestjs/swagger';
import { UserTeam } from '@entities';
import { DefaultResponsesDto, PaginationResponsesDto } from '@dtos';
export class CreateTeamRequestDto extends PickType(UserTeam, ['description', 'name', 'managerId'] as const) {}
export class UpdateTeamRequestDto extends PartialType(CreateTeamRequestDto) {}
export class ListTeamResponseDto extends PartialType(PaginationResponsesDto) {
  readonly data: UserTeam[];
}
export class TeamResponseDto extends PartialType(DefaultResponsesDto) {
  readonly data: UserTeam;
}
