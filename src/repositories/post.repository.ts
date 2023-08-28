import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { Post, PostTranslation } from '@entities';
import { DataSource } from 'typeorm';
import { CreatePostRequestDto, UpdatePostRequestDto } from '@dtos';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  /**
   *
   * @param code
   * @returns number
   *
   */
  async getCountByCode(code: string): Promise<number> {
    return await this.createQueryBuilder('base').where(`base.type=:code`, { code }).withDeleted().getCount();
  }

  /**
   *
   * @param code
   * @param i18n
   * @returns Post
   *
   */
  async createWithTranslation({ translations, ...body }: CreatePostRequestDto, i18n: I18nContext): Promise<Post> {
    let result: Post = null;
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
        if (existingName) throw new BadRequestException(i18n.t('common.Post.name is already taken'));

        await entityManager.save(entityManager.create(PostTranslation, { postId: result.id, ...item }));
      }
    });
    return result;
  }

  /**
   *
   * @param code
   * @param id
   * @param i18n
   * @returns Post
   *
   */
  async updateWithTranslation(
    id: string,
    { translations, ...body }: UpdatePostRequestDto,
    i18n: I18nContext,
  ): Promise<Post> {
    let result: Post = null;
    await this.dataSource.transaction(async (entityManager) => {
      const data = await entityManager.preload(Post, {
        id,
        ...body,
      });
      if (!data) {
        throw new BadRequestException(i18n.t('common.Data id not found', { args: { id } }));
      }
      result = await this.save(data);
      for (const item of translations) {
        const existingName = await entityManager
          .createQueryBuilder(PostTranslation, 'base')
          .andWhere(`base.name=:name`, { name: item.name })
          .andWhere(`base.language=:language`, { language: item.language })
          .andWhere(`base.postId != :postId`, { postId: id })
          .withDeleted()
          .getCount();
        if (existingName) throw new BadRequestException(i18n.t('common.Post.name is already taken'));

        await entityManager.save(await entityManager.preload(PostTranslation, { postId: result.id, ...item }));
      }
    });
    return result;
  }
}
