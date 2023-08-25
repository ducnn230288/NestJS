import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import dayjs from 'dayjs';

import { Auth, Headers, MaxGroup, OnlyUpdateGroup, Public, SerializerBody } from '@common';
import {
  PaginationQueryDto,
  CreateUserRequestDto,
  ListUserResponseDto,
  UpdateUserRequestDto,
  UserResponseDto,
} from '@dtos';
import { P_USER_CREATE, P_USER_DELETE, P_USER_DETAIL, P_USER_LISTED, P_USER_UPDATE, UserService } from '@services';

@Headers('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Auth({
    summary: 'Get List User',
    permission: P_USER_LISTED,
  })
  @Get()
  async findAll(@I18n() i18n: I18nContext, @Query() paginationQuery: PaginationQueryDto): Promise<ListUserResponseDto> {
    const [result, total] = await this.service.findAll(paginationQuery);
    return {
      message: i18n.t('common.Get List success'),
      count: total,
      data: result,
    };
  }

  @Auth({
    summary: 'Get Detail User',
    permission: P_USER_DETAIL,
    serializeOptions: { groups: [MaxGroup] },
  })
  @Get(':id')
  async findOne(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<UserResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findOne(id, [], i18n),
    };
  }

  @Auth({
    summary: 'Create User',
    permission: P_USER_CREATE,
    serializeOptions: { groups: [MaxGroup] },
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([MaxGroup, OnlyUpdateGroup])) createData: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    return {
      message: i18n.t('common.Create Success'),
      data: await this.service.create(createData, i18n),
    };
  }

  @Public({
    summary: 'Update all days off',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Put('all-days-off')
  async updateAllDaysOff(@I18n() i18n: I18nContext): Promise<UserResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.updateAllDaysOff(i18n),
    };
  }

  @Auth({
    summary: 'Update date leave',
    permission: P_USER_UPDATE,
  })
  @Put('dateLeave/:dateLeave')
  async updateDateOff(@I18n() i18n: I18nContext, @Param('dateLeave') dateLeave: string): Promise<UserResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(undefined, { dateLeave }, i18n),
    };
  }

  @Auth({
    summary: 'Update User',
    permission: P_USER_UPDATE,
    serializeOptions: { groups: [MaxGroup] },
  })
  @Put(':id')
  async update(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Body(new SerializerBody([MaxGroup])) updateData: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, updateData, i18n, (data) => {
        delete data.password;
        return data;
      }),
    };
  }

  @Auth({
    summary: 'Update disable',
    permission: P_USER_UPDATE,
  })
  @Put(':id/disable/:boolean')
  async updateDisable(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Param('boolean') boolean: string,
  ): Promise<UserResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, { isDisabled: boolean === 'true' ? dayjs().toDate() : null }, i18n),
    };
  }

  @Auth({
    summary: 'Delete User',
    permission: P_USER_DELETE,
    serializeOptions: { groups: [MaxGroup] },
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<UserResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.remove(id, i18n),
    };
  }
}
