import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

import { BaseService } from '@common';
import { AllPageRequestDto, CreatePageRequestDto, ItemPageRequestDto, ListPageDto, UpdatePageRequestDto } from '@dtos';
import { Page, PageTranslation } from '@entities';

export const P_PAGE_LISTED = '6ac2a002-3f26-40d1-ac56-61c681af832f';
export const P_PAGE_CREATE = '5f877438-33b5-4145-baf9-9e9576c540f7';
export const P_PAGE_UPDATE = '0bd50247-a770-4d05-bc29-5b337fc268fa';
export const P_PAGE_DELETE = '1fd2b6de-3ccb-4119-8b26-877b81dd9836';

@Injectable()
export class PageService extends BaseService {
  constructor(
    @InjectRepository(Page)
    public readonly repo: Repository<Page>,
    @InjectRepository(PageTranslation)
    public readonly repoTranslation: Repository<PageTranslation>,
    private readonly dataSource: DataSource,
  ) {
    super(repo);
    this.listJoin = ['translations'];
  }

  async findAllParent(i18n: I18nContext) {
    const data = await this.dataSource.manager.getTreeRepository<ListPageDto>(Page).findTrees({
      relations: ['translations'],
    });
    if (!data) {
      throw new NotFoundException(i18n.t('common.Page.data Homepage not found'));
    }
    return data;
  }

  async findOneBySlug(slug: string, language: string, i18n: I18nContext) {
    const data = await this.repoTranslation
      .createQueryBuilder('base')
      .andWhere(`base.slug=:slug`, { slug })
      .andWhere(`base.language=:language`, { language })
      .withDeleted()
      .getOne();
    if (!data) {
      throw new NotFoundException(i18n.t('common.Page.Data slug not found', { args: { slug } }));
    }
    return await this.findOne(data.pageId);
  }

  async create({ translations, parentId, ...body }: CreatePageRequestDto, i18n: I18nContext) {
    let result = null;
    await this.dataSource.transaction(async (entityManager) => {
      const create = entityManager.create(Page, { ...body });
      if (parentId) {
        create.parent = await entityManager
          .createQueryBuilder(Page, 'base')
          .where(`base.id=:parentId`, { parentId })
          .withDeleted()
          .getOne();
      }
      result = await entityManager.save(create);
      for (const { id, ...item } of translations) {
        const existingTitle = await entityManager
          .createQueryBuilder(PageTranslation, 'base')
          .andWhere(`base.title=:title`, { title: item.title })
          .andWhere(`base.language=:language`, { language: item.language })
          .withDeleted()
          .getCount();
        if (existingTitle) {
          throw new BadRequestException(i18n.t('common.Page.Title is already taken'));
        }
        const existingSlug = await entityManager
          .createQueryBuilder(PageTranslation, 'base')
          .andWhere(`base.title=:slug`, { slug: item.slug })
          .andWhere(`base.language=:language`, { language: item.language })
          .withDeleted()
          .getCount();
        if (existingSlug) {
          throw new BadRequestException(`slug is already taken`);
        }
        await entityManager.save(entityManager.create(PageTranslation, { pageId: result.id, ...item }));
      }
      result = this.findOne(result.id);
    });
    return result;
  }

  async update(id: string, { translations, parentId, ...body }: UpdatePageRequestDto, i18n: I18nContext) {
    let result = null;
    await this.dataSource.transaction(async (entityManager) => {
      const data = await entityManager.preload(Page, {
        id,
        ...body,
      });
      if (!data) {
        throw new NotFoundException(i18n.t('common.user.Data id not found', { args: { id } }));
      }
      if (parentId) {
        data.parent = await entityManager
          .createQueryBuilder(Page, 'base')
          .where(`base.id=:parentId`, { parentId })
          .withDeleted()
          .getOne();
      }
      result = await entityManager.save(data);
      for (const item of translations) {
        const existingTitle = await entityManager
          .createQueryBuilder(PageTranslation, 'base')
          .andWhere(`base.title=:title`, { title: item.title })
          .andWhere(`base.language=:language`, { language: item.language })
          .andWhere(`base.pageId != :pageId`, { pageId: id })
          .withDeleted()
          .getCount();
        if (existingTitle) {
          throw new BadRequestException(i18n.t('common.Page.Title is already taken'));
        }
        const existingSlug = await entityManager
          .createQueryBuilder(PageTranslation, 'base')
          .andWhere(`base.slug=:slug`, { slug: item.slug })
          .andWhere(`base.language=:language`, { language: item.language })
          .andWhere(`base.pageId != :pageId`, { pageId: id })
          .withDeleted()
          .getCount();
        if (existingSlug) {
          throw new BadRequestException(`slug is already taken`);
        }
        await entityManager.save(await entityManager.preload(PageTranslation, { pageId: result.id, ...item }));
      }
      result = this.findOne(result.id);
    });
    return result;
  }

  async updateAll(body: AllPageRequestDto, i18n: I18nContext) {
    let result = null;
    await this.dataSource.transaction(async (entityManager) => {
      const loop = async (values: ItemPageRequestDto[]) => {
        for (const item of values) {
          const children = item.children;
          delete item.children;
          const data = await entityManager.preload(Page, item);
          if (!data) {
            throw new NotFoundException(i18n.t('common.user.Data id not found', { args: { id: item.id } }));
          }
          data.children = [];
          // if (item.parents) {
          //   for (const id of item.parents) {
          //     data.children.push(new Page({ id }));
          //   }
          // }
          result = await this.repo.save(data);
          if (children) {
            await loop(children);
          }
        }
      };
      await loop(body.values);
    });
    return result;
  }
}
