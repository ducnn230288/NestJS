import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common';
import { PostTranslation } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class PostTranslationRepository extends BaseRepository<PostTranslation> {
  constructor(private readonly dataSource: DataSource) {
    super(PostTranslation, dataSource.createEntityManager());
  }

  async getDataBySlug(slug: string) {
    return await this.createQueryBuilder('base').where(`base.slug=:slug`, { slug }).withDeleted().getOne();
  }
}
