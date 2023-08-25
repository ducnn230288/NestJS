import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { PostType } from '@entities';

export class PostTypeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(PostType);
    const listData: PostType[] = [
      { name: 'News', code: 'news', isPrimary: true },
      { name: 'Projects', code: 'projects', isPrimary: true },
    ];

    for (const data of listData) {
      const dataExists = await repository
        .createQueryBuilder('base')
        .andWhere(`base.code=:code`, { code: data.code })
        .getOne();

      if (!dataExists) {
        const newData = repository.create(data);
        await repository.save(newData);
      }
    }
  }
}
