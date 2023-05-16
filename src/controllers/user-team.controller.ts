import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, SerializerBody } from '@common';
import {
  PaginationQueryDto,
  ListTeamResponseDto,
  TeamResponseDto,
  CreateTeamRequestDto,
  UpdateTeamRequestDto,
} from '@dtos';
import {
  UserTeamService,
  P_USER_TEAM_LISTED,
  P_USER_TEAM_DETAIL,
  P_USER_TEAM_CREATE,
  P_USER_TEAM_UPDATE,
  P_USER_TEAM_DELETE,
} from '@services';

@Headers('user-team')
export class UserTeamController {
  constructor(private readonly service: UserTeamService) {}

  @Auth({
    summary: 'Get List Team',
    permission: P_USER_TEAM_LISTED,
  })
  @Get()
  async findAll(@I18n() i18n: I18nContext, @Query() paginationQuery: PaginationQueryDto): Promise<ListTeamResponseDto> {
    const [result, total] = await this.service.findAll(paginationQuery);
    return {
      message: i18n.t('common.Get List success'),
      count: total,
      data: result,
    };
  }

  @Auth({
    summary: 'Get Detail Team',
    permission: P_USER_TEAM_DETAIL,
  })
  @Get(':id')
  async findOne(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<TeamResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findOne(id),
    };
  }

  @Auth({
    summary: 'Create Team',
    permission: P_USER_TEAM_CREATE,
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody()) createTeamDto: CreateTeamRequestDto,
  ): Promise<TeamResponseDto> {
    const data = await this.service.create(createTeamDto, i18n);
    // await this.service.history(data, 'CREATED');
    return {
      message: i18n.t('common.Create Success'),
      data,
    };
  }

  @Auth({
    summary: 'Update Team',
    permission: P_USER_TEAM_UPDATE,
  })
  @Put(':id')
  async update(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Body(new SerializerBody()) updateTeamDto: UpdateTeamRequestDto, //
  ): Promise<TeamResponseDto> {
    const data = await this.service.update(id, updateTeamDto, i18n);
    // await this.service.history(data);

    return {
      message: i18n.t('common.Update Success'),
      data,
    };
  }

  @Auth({
    summary: 'Delete Team',
    permission: P_USER_TEAM_DELETE,
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<TeamResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.remove(id, i18n),
    };
  }
}
