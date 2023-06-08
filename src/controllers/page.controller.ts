import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, SerializerBody, MaxGroup, Public } from '@common';
import {
  ListPageResponseDto,
  PageResponseDto,
  CreatePageRequestDto,
  UpdatePageRequestDto,
  AllPageRequestDto,
  ListPageDto,
} from '@dtos';
import { PageService, P_PAGE_CREATE, P_PAGE_UPDATE, P_PAGE_DELETE } from '@services';

@Headers('page')
export class PageController {
  constructor(private readonly service: PageService) {}

  @Auth({
    summary: 'Get List data',
  })
  @Get()
  async findAll(@I18n() i18n: I18nContext): Promise<ListPageResponseDto> {
    const result = await this.service.findAllParent(i18n);
    return {
      message: i18n.t('common.Get List success'),
      count: 0,
      data: result as ListPageDto[],
    };
  }
  // @Public({
  //   summary: 'Get Detail data by slug',
  //   serializeOptions: { groups: [MaxGroup] },
  // })
  // @Get('/slug/:slug')
  // async findOneBySlug(@I18n() i18n: I18nContext, @Param('slug') slug: string): Promise<PageResponseDto> {
  //   return {
  //     message: i18n.t('common.Get Detail Success'),
  //     data: await this.service.findOneBySlug(slug, i18n.lang, i18n),
  //   };
  // }

  @Auth({
    summary: 'Get Detail data',
    serializeOptions: { groups: [MaxGroup] },
  })
  @Get(':id')
  async findOne(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findOne(id),
    };
  }

  @Auth({
    summary: 'Create data',
    permission: P_PAGE_CREATE,
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([MaxGroup])) body: CreatePageRequestDto,
  ): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Create Success'),
      data: await this.service.create(body, i18n),
    };
  }

  @Auth({
    summary: 'Update all order data',
    permission: P_PAGE_UPDATE,
  })
  @Put('/all')
  async updateAll(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody()) body: AllPageRequestDto,
  ): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.updateAll(body, i18n),
    };
  }

  @Auth({
    summary: 'Update data',
    permission: P_PAGE_UPDATE,
    serializeOptions: { groups: [MaxGroup] },
  })
  @Put(':id')
  async update(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Body(new SerializerBody([MaxGroup])) body: UpdatePageRequestDto, //
  ): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, body, i18n),
    };
  }

  @Auth({
    summary: 'Delete data',
    permission: P_PAGE_DELETE,
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.removeHard(id),
    };
  }
}
