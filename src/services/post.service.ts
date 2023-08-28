import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

import { BaseService } from '@common';
import { CreatePostRequestDto, UpdatePostRequestDto } from '@dtos';
import { Data, Post } from '@entities';
import { PostRepository, PostTranslationRepository } from '@repositories';

export const P_POST_LISTED = '7c34dc92-cbbe-4419-8dbc-745818d76098';
export const P_POST_CREATE = '0ca9634c-3496-4059-bf86-5bec23c96b55';
export const P_POST_UPDATE = 'eda2799a-4072-46a7-9a26-efa9a98036db';
export const P_POST_DELETE = '4097d5ff-e35c-4bff-a5b1-013ca1181762';

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(
    public repo: PostRepository,
    public repoTranslation: PostTranslationRepository,
  ) {
    super(repo);
    this.listJoin = ['translations'];
  }

  /**
   *
   * @param types
   * @returns { [p]: Data[] }
   *
   */
  async findArrayCode(types: string[]): Promise<{ [p: string]: Data[] }> {
    const tempData: { [key: string]: Data[] } = {};
    for (const type of types) {
      tempData[type] = (await this.findAll({ filter: { type, isDisabled: 'NULL' }, sorts: { createdAt: 'DESC' } }))[0];
    }
    return tempData;
  }

  /**
   *
   * @param slug
   * @param i18n
   * @returns Post
   *
   */
  async findSlug(slug: string, i18n: I18nContext): Promise<Post> {
    const { postId } = await this.repoTranslation.getDataBySlug(slug);
    return this.findOne(postId, [], i18n);
  }

  /**
   *
   * @param body
   * @param i18n
   * @returns Post
   *
   */
  async create(body: CreatePostRequestDto, i18n: I18nContext): Promise<Post> {
    return await this.repo.createWithTranslation(body, i18n);
  }

  /**
   *
   * @param id
   * @param body
   * @param i18n
   * @returns Post
   *
   */
  async update(id: string, body: UpdatePostRequestDto, i18n: I18nContext): Promise<Post> {
    return await this.repo.updateWithTranslation(id, body, i18n);
  }
}
