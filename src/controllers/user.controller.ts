import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, MaxGroup, OnlyUpdateGroup, SerializerBody } from '@common';
import {
  PaginationQueryDto,
  CreateUserRequestDto,
  ListUserResponseDto,
  UpdateUserRequestDto,
  UserResponseDto,
  DefaultAuthResponsesUserDto,
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
      data: await this.service.findOne(id),
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
    const data = await this.service.create(createData, i18n);
    // await this.service.history(data, 'CREATED');
    return {
      message: i18n.t('common.Create Success'),
      data: data as DefaultAuthResponsesUserDto,
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
    const data = await this.service.update(id, updateData, i18n);
    // await this.service.history(data);
    return {
      message: i18n.t('common.Update Success'),
      data: data as DefaultAuthResponsesUserDto,
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
