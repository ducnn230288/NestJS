import { Body, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { Auth, Headers, Public, SerializerBody } from '@common';
import {
  PaginationQueryDto,
  ListCustomerResponseDto,
  CustomerResponseDto,
  CreateCustomerRequestDto,
  UpdateCustomerRequestDto,
  CreateClientCustomerRequestDto,
} from '@dtos';
import {
  CustomerService,
  P_CUSTOMER_LISTED,
  P_CUSTOMER_DETAIL,
  P_CUSTOMER_CREATE,
  P_CUSTOMER_UPDATE,
  P_CUSTOMER_DELETE,
} from '@services';

@Headers('customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Auth({
    summary: 'Get List data',
    permission: P_CUSTOMER_LISTED,
  })
  @Get()
  async findAll(
    @I18n() i18n: I18nContext,
    @Query(new ValidationPipe({ transform: true })) paginationQuery: PaginationQueryDto,
  ): Promise<ListCustomerResponseDto> {
    const [result, total] = await this.service.findAll(paginationQuery);
    return {
      message: i18n.t('common.Get List success'),
      count: total,
      data: result,
    };
  }

  @Auth({
    summary: 'Get Detail data',
    permission: P_CUSTOMER_DETAIL,
  })
  @Get(':id')
  async findOne(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<CustomerResponseDto> {
    return {
      message: i18n.t('common.Get Detail Success'),
      data: await this.service.findOne(id),
    };
  }

  @Auth({
    summary: 'Create data',
    permission: P_CUSTOMER_CREATE,
  })
  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody()) body: CreateCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return {
      message: i18n.t('common.Create Success'),
      data: await this.service.create(body, i18n),
    };
  }

  @Public({
    summary: 'Create data for client',
  })
  @Post('/client')
  async createClient(
    @I18n() i18n: I18nContext,
    @Body(new SerializerBody()) body: CreateClientCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return {
      message: i18n.t('common.Create Success'),
      data: await this.service.create(body, i18n),
    };
  }

  @Auth({
    summary: 'Update data',
    permission: P_CUSTOMER_UPDATE,
  })
  @Put(':id')
  async update(
    @I18n() i18n: I18nContext,
    @Param('id') id: string,
    @Body(new SerializerBody()) body: UpdateCustomerRequestDto, //
  ): Promise<CustomerResponseDto> {
    return {
      message: i18n.t('common.Update Success'),
      data: await this.service.update(id, body, i18n),
    };
  }

  @Auth({
    summary: 'Delete data',
    permission: P_CUSTOMER_DELETE,
  })
  @Delete(':id')
  async remove(@I18n() i18n: I18nContext, @Param('id') id: string): Promise<CustomerResponseDto> {
    return {
      message: i18n.t('common.Delete Success'),
      data: await this.service.remove(id, i18n),
    };
  }
}
