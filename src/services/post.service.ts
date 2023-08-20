import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

import { BaseService } from '@common';
import { CreatePostRequestDto, UpdatePostRequestDto } from '@dtos';
import { Data, Post, PostTranslation } from '@entities';

export const P_POST_LISTED = '7c34dc92-cbbe-4419-8dbc-745818d76098';
export const P_POST_CREATE = '0ca9634c-3496-4059-bf86-5bec23c96b55';
export const P_POST_UPDATE = 'eda2799a-4072-46a7-9a26-efa9a98036db';
export const P_POST_DELETE = '4097d5ff-e35c-4bff-a5b1-013ca1181762';

@Injectable()
export class PostService extends BaseService {
  constructor(
    @InjectRepository(Post)
    public repo: Repository<Post>,
    @InjectRepository(PostTranslation)
    public repoTranslation: Repository<PostTranslation>,
    private readonly dataSource: DataSource,
  ) {
    super(repo);
    this.listJoin = ['translations'];
  }

  async findArrayCode(types: string[]) {
    const tempData: { [key: string]: Data[] } = {};
    for (const type of types) {
      tempData[type] = (await this.findAll({ filter: { type, isDisabled: 'NULL' }, sorts: { createdAt: 'DESC' } }))[0];
    }
    return tempData;
  }

  async findSlug(slug: string, i18n: I18nContext) {
    const { postId } = await this.repoTranslation
      .createQueryBuilder('base')
      .where(`base.slug=:slug`, { slug })
      .withDeleted()
      .getOne();
    return this.findOne(postId, [], i18n);
  }

  async create({ translations, ...body }: CreatePostRequestDto, i18n: I18nContext) {
    let result = null;
    await this.dataSource.transaction(async (entityManager) => {
      result = await entityManager.save(entityManager.create(Post, { ...body }));
      for (const item of translations) {
        delete item.id;
        const existingName = await entityManager
          .createQueryBuilder(PostTranslation, 'base')
          .andWhere(`base.name=:name`, { name: item.name })
          .andWhere(`base.language=:language`, { language: item.language })
          .withDeleted()
          .getCount();
        if (existingName) {
          throw new BadRequestException(i18n.t('common.Post.name is already taken'));
        }
        await entityManager.save(entityManager.create(PostTranslation, { postId: result.id, ...item }));
      }
    });
    return result;
  }

  async update(id: string, { translations, ...body }: UpdatePostRequestDto, i18n: I18nContext) {
    let result = null;
    await this.dataSource.transaction(async (entityManager) => {
      const data = await entityManager.preload(Post, {
        id,
        ...body,
      });
      if (!data) {
        throw new BadRequestException(i18n.t('common.Data id not found', { args: { id } }));
      }
      result = await this.repo.save(data);
      for (const item of translations) {
        const existingName = await entityManager
          .createQueryBuilder(PostTranslation, 'base')
          .andWhere(`base.name=:name`, { name: item.name })
          .andWhere(`base.language=:language`, { language: item.language })
          .andWhere(`base.postId != :postId`, { postId: id })
          .withDeleted()
          .getCount();
        if (existingName) {
          throw new BadRequestException(i18n.t('common.Post.name is already taken'));
        }
        await entityManager.save(await entityManager.preload(PostTranslation, { postId: result.id, ...item }));
      }
    });
    return result;
  }
}
