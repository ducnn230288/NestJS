import { Body, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import * as dayjs from 'dayjs';

import { Auth, Headers, MaxGroup, Public, SerializerBody } from '@common';
import {
  PaginationQueryDto,
  PostResponseDto,
  ListPostResponseDto,
  CreatePostRequestDto,
  UpdatePostRequestDto,
  ArrayDataTypeResponseDto,
} from '@dtos';
import { PostService, P_POST_LISTED, P_POST_CREATE, P_POST_UPDATE, P_POST_DELETE } from '@services';

@Headers('post')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Auth({
    summary: 'Get List data',
    permission: P_POST_LISTED,
    serializeOptions: { groups: [] },
  })
  @Get()
  async findAll(
    @I18n() i18n: I18nContext,
    @Query(new ValidationPipe({ transform: true })) paginationQuery: PaginationQueryDto,
  ): Promise<ListPostResponseDto> {
    const [result, total] = await this.service.findAll(paginationQuery);
    return {
      message: i18n.t('common.Get List success'),
      count: total,
      data: result,
    };
  }

  @Public({
    summary: 'Get Detail data',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Get('/array')
  async findOneByArray(
    @I18n() i18n: I18nContext,
    @Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto,
  ): Promise<ArrayDataTypeResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findArrayCode(query.array),
    };
  }

  @Public({
    summary: 'Get Detail data',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Get('/slug/:slug')
  async findSlug(@I18n() i18n: I18nContext, @Param('slug') slug: string): Promise<PostResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findSlug(slug, i18n),
    };
  }

  @Auth({
    summary: 'Get Detail data',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Get(':id')
  async findOne(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<PostResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findOne(id, [], i18n),
    };
  }

  @Auth({
    summary: 'Create data',
    permission: P_POST_CREATE,
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([MaxGroup])) body: CreatePostRequestDto,
  ): Promise<PostResponseDto> {
    return {
      message: i18n.t('common.Create Success'),
      data: await this.service.create(body, i18n),
    };
  }

  @Auth({
    summary: 'Update data',
    permission: P_POST_UPDATE,
  })
  @Put(':id')
  async update(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Body(new SerializerBody([MaxGroup])) body: UpdatePostRequestDto,
  ): Promise<PostResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, body, i18n),
    };
  }

  @Auth({
    summary: 'Update disable',
    permission: P_POST_UPDATE,
  })
  @Put(':id/disable/:boolean')
  async updateDisable(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Param('boolean') boolean: string,
  ): Promise<PostResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, { isDisabled: boolean === 'true' ? dayjs().toDate() : null }, i18n),
    };
  }

  @Auth({
    summary: 'Delete data',
    permission: P_POST_DELETE,
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<PostResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.removeHard(id, i18n),
    };
  }
}
