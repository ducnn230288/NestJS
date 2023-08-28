import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { PostTranslation } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class PostTranslationRepository extends BaseRepository<PostTranslation> {
  constructor(private readonly dataSource: DataSource) {
    super(PostTranslation, dataSource.createEntityManager());
  }

  /**
   *
   * @param slug
   * @returns PostTranslation
   *
   */
  async getDataBySlug(slug: string): Promise<PostTranslation> {
    return await this.createQueryBuilder('base').where(`base.slug=:slug`, { slug }).withDeleted().getOne();
  }
}
