import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, SerializerBody, MaxGroup, Public, RelationGroup } from '@common';
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

  @Public({
    summary: 'Get List data',
    serializeOptions: { groups: [RelationGroup] },
  })
  @Get()
  async findAll(@I18n() i18n: I18nContext): Promise<ListPageResponseDto> {
    const [result, total] = await this.service.findAllParent(i18n);
    return {
      message: i18n.t('common.Get List success'),
      count: total,
      data: result as ListPageDto[],
    };
  }
  @Public({
    summary: 'Get Detail data by slug',
    serializeOptions: { groups: [MaxGroup, RelationGroup] },
  })
  @Get('/slug/:slug')
  async findOneBySlug(@I18n() i18n: I18nContext, @Param('slug') slug: string): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findOneBySlug(slug, i18n.lang, i18n),
    };
  }

  @Public({
    summary: 'Get Detail data',
    serializeOptions: { groups: [MaxGroup, RelationGroup] },
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
    serializeOptions: { groups: [RelationGroup] },
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody([RelationGroup])) body: CreatePageRequestDto,
  ): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Create Success'),
      data: await this.service.create(body, i18n),
    };
  }

  @Auth({
    summary: 'Update all order data',
    permission: P_PAGE_UPDATE,
    serializeOptions: { groups: [RelationGroup] },
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
    serializeOptions: { groups: [RelationGroup] },
  })
  @Put(':id')
  async update(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Body(new SerializerBody([RelationGroup])) body: UpdatePageRequestDto, //
  ): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, body, i18n),
    };
  }

  @Auth({
    summary: 'Delete data',
    permission: P_PAGE_DELETE,
    serializeOptions: { groups: [RelationGroup] },
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<PageResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.removeHard(id),
    };
  }
}
