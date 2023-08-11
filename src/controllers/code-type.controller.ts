import { Body, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, SerializerBody, MaxGroup } from '@common';
import {
  PaginationQueryDto,
  CodeTypeResponseDto,
  CodeTypeRelationshipResponseDto,
  ListCodeTypeResponseDto,
  CreateCodeTypeRequestDto,
  UpdateCodeTypeRequestDto,
  CodeTypeRelationshipDto,
} from '@dtos';
import {
  CodeTypeService,
  P_CODE_TYPE_LISTED,
  P_CODE_TYPE_DETAIL,
  P_CODE_TYPE_CREATE,
  P_CODE_TYPE_UPDATE,
  P_CODE_TYPE_DELETE,
} from '@services';
import * as dayjs from 'dayjs';

@Headers('code-type')
export class CodeTypeController {
  constructor(private readonly service: CodeTypeService) {}

  @Auth({
    summary: 'Get List data',
    permission: P_CODE_TYPE_LISTED,
  })
  @Get()
  async findAll(
    @I18n() i18n: I18nContext,
    @Query(new ValidationPipe({ transform: true })) paginationQuery: PaginationQueryDto,
  ): Promise<ListCodeTypeResponseDto> {
    const [result, total] = await this.service.findAll(paginationQuery);
    return {
      message: i18n.t('common.Get List success'),
      count: total,
      data: result,
    };
  }

  @Auth({
    summary: 'Get Detail data',
    serializeOptions: { groups: [MaxGroup] },
    permission: P_CODE_TYPE_DETAIL,
  })
  @Get(':code')
  async findOne(@I18n() i18n: I18nContext, @Param('code') code: string): Promise<CodeTypeRelationshipResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: (await this.service.findOneCode(code, i18n)) as CodeTypeRelationshipDto,
    };
  }

  @Auth({
    summary: 'Create data',
    permission: P_CODE_TYPE_CREATE,
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,

    @Body(new SerializerBody([MaxGroup])) body: CreateCodeTypeRequestDto,
  ): Promise<CodeTypeResponseDto> {
    return {
      message: i18n.t('common.Create Success'),
      data: await this.service.create(body, i18n),
    };
  }

  @Auth({
    summary: 'Update data',
    permission: P_CODE_TYPE_UPDATE,
  })
  @Put(':id')
  async update(
    @I18n() i18n: I18nContext,

    @Param('id') id: string,
    @Body(new SerializerBody()) body: UpdateCodeTypeRequestDto,
  ): Promise<CodeTypeResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, body, i18n),
    };
  }

  @Auth({
    summary: 'Update disable',
    permission: P_CODE_TYPE_UPDATE,
  })
  @Put(':id/disable/:boolean')
  async updateDisable(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Param('boolean') boolean: string,
  ): Promise<CodeTypeResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, { isDisabled: boolean === 'true' ? dayjs().toDate() : null }, i18n),
    };
  }

  @Auth({
    summary: 'Delete data',
    permission: P_CODE_TYPE_DELETE,
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<CodeTypeResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.removeHard(id, i18n),
    };
  }
}
