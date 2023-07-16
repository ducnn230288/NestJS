import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@common';
import { PostType } from '@entities';

export const P_POST_TYPE_LISTED = 'efa34c52-8c9a-444d-a82b-8bec109dbab5';
export const P_POST_TYPE_CREATE = '87cb77c4-565c-43ec-bffc-fbaf5077c2be';
export const P_POST_TYPE_UPDATE = 'bfa36cef-71c4-4f08-89e6-d7e0c1c03ba4';
export const P_POST_TYPE_DELETE = 'cd00c62e-1ec4-4c61-b273-cdd6867a3212';

@Injectable()
export class PostTypeService extends BaseService {
  constructor(
    @InjectRepository(PostType)
    public repo: Repository<PostType>,
  ) {
    super(repo);
  }

  async findArrayCode(slugs: string[]) {
    const tempData: { [key: string]: PostType } = {};
    for (const slug of slugs) {
      tempData[slug] = await this.findCode(slug);
    }
    return tempData;
  }

  async findCode(slug: string) {
    const data = await this.repo
      .createQueryBuilder('base')
      .where(`base.slug=:slug`, { slug })
      .leftJoinAndMapMany('base.items', 'Post', 'post', 'base.slug = post.type')
      .addOrderBy('data.createdAt', 'ASC')
      .withDeleted()
      .getOne();
    if (!data) {
      throw new NotFoundException(`data  ${slug} not found`);
    }
    return data;
  }
}
