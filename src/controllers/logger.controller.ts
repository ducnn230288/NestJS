import { Delete, Get, Param, Query } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, MaxGroup } from '@common';
import { PaginationQueryDto, ListErrorResponseDto, ErrorResponseDto } from '@dtos';
import { P_ERROR_DELETE, P_ERROR_DETAIL, P_ERROR_LISTED, ErrorService } from '@services';

@Headers('error')
export class ErrorController {
  constructor(private readonly service: ErrorService) {}

  @Auth({
    summary: 'Get List Data',
    permission: P_ERROR_LISTED,
  })
  @Get()
  async findAll(
    @I18n() i18n: I18nContext,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<ListErrorResponseDto> {
    const [result, total] = await this.service.findAll(paginationQuery);
    return {
      message: i18n.t('common.Get List success'),
      count: total,
      data: result,
    };
  }

  @Auth({
    summary: 'Get Detail Data',
    permission: P_ERROR_DETAIL,
    serializeOptions: { groups: [MaxGroup] },
  })
  @Get(':id')
  async findOne(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<ErrorResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findOne(id, [], i18n),
    };
  }

  // @Auth({
  //   summary: 'Create Data',
  //   permission: P_ERROR_CREATE,
  //   serializeOptions: { groups: [MaxGroup] },
  // })
  // @Post()
  // async create(
  //   @I18n() i18n: I18nContext,
  //   @Body(new SerializerBody([MaxGroup, OnlyUpdateGroup])) createData: CreateUserRequestDto,
  // ): Promise<UserResponseDto> {
  //   return {
  //     message: i18n.t('common.Create Success'),
  //     data: await this.service.create(createData, i18n),
  //   };
  // }
  //
  // @Auth({
  //   summary: 'Update Data',
  //   permission: P_ERROR_UPDATE,
  //   serializeOptions: { groups: [MaxGroup] },
  // })
  // @Put(':id')
  // async update(
  //   @I18n() i18n: I18nContext,
  //   @Param('id') id: string,
  //   @Body(new SerializerBody([MaxGroup])) updateData: UpdateUserRequestDto,
  // ): Promise<UserResponseDto> {
  //   return {
  //     message: i18n.t('common.Update Success'),
  //     data: await this.service.update(id, updateData, i18n),
  //   };
  // }
  //
  // @Auth({
  //   summary: 'Update disable',
  //   permission: P_ERROR_UPDATE,
  // })
  // @Put(':id/disable/:boolean')
  // async updateDisable(
  //   @I18n() i18n: I18nContext,
  //   @Param('id') id: string,
  //   @Param('boolean') boolean: string,
  // ): Promise<UserResponseDto> {
  //   return {
  //     message: i18n.t('common.Update Success'),
  //     data: await this.service.update(id, { isDisabled: boolean === 'true' ? dayjs().toDate() : null }, i18n),
  //   };
  // }

  @Auth({
    summary: 'Delete Data',
    permission: P_ERROR_DELETE,
    serializeOptions: { groups: [MaxGroup] },
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<ErrorResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.remove(id, i18n),
    };
  }
}
