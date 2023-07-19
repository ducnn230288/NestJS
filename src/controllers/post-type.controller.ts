import { Body, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, MaxGroup, Public, SerializerBody } from '@common';
import {
  PaginationQueryDto,
  ArrayPostTypeResponseDto,
  CreatePostTypeRequestDto,
  PostTypeResponseDto,
  ListPostTypeResponseDto,
  UpdatePostTypeRequestDto,
} from '@dtos';
import {
  PostTypeService,
  P_POST_TYPE_CREATE,
  P_POST_TYPE_DELETE,
  P_POST_TYPE_LISTED,
  P_POST_TYPE_UPDATE,
} from '@services';

@Headers('post-type')
export class PostTypeController {
  constructor(private readonly service: PostTypeService) {}

  @Auth({
    summary: 'Get List data',
    permission: P_POST_TYPE_LISTED,
  })
  @Get()
  async findAll(
    @I18n() i18n: I18nContext,
    @Query(new ValidationPipe({ transform: true })) paginationQuery: PaginationQueryDto,
  ): Promise<ListPostTypeResponseDto> {
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
    @Query(new ValidationPipe({ transform: true })) query: { array: string[] },
  ): Promise<ArrayPostTypeResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findArrayCode(query.array, i18n),
    };
  }

  @Public({
    summary: 'Get Detail data by code',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Get('code/:code')
  async findOneCode(@I18n() i18n: I18nContext, @Param('code') code: string): Promise<PostTypeResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findCode(code, i18n),
    };
  }

  @Public({
    summary: 'Get Detail data',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Get(':id')
  async findOne(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<PostTypeResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findOne(id),
    };
  }

  @Auth({
    summary: 'Create data',
    permission: P_POST_TYPE_CREATE,
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([MaxGroup])) body: CreatePostTypeRequestDto,
  ): Promise<PostTypeResponseDto> {
    return {
      message: i18n.t('common.Create Success'),
      data: await this.service.create(body, i18n),
    };
  }

  @Auth({
    summary: 'Update data',
    permission: P_POST_TYPE_UPDATE,
  })
  @Put(':id')
  async update(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Body(new SerializerBody()) body: UpdatePostTypeRequestDto,
  ): Promise<PostTypeResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, body, i18n),
    };
  }

  @Auth({
    summary: 'Delete data',
    permission: P_POST_TYPE_DELETE,
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<PostTypeResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.removeCheck(id, i18n),
    };
  }
}
