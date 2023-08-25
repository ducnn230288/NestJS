import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { DataType } from '@entities';

export class DataTypeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(DataType);
    const listData: DataType[] = [
      { name: 'Mission', code: 'mission', isPrimary: true },
      { name: 'Services', code: 'services', isPrimary: true },
      { name: 'Value', code: 'value', isPrimary: true },
      { name: 'Member', code: 'member', isPrimary: true },
      { name: 'Partner', code: 'partner', isPrimary: true },
      { name: 'Tech', code: 'tech', isPrimary: true },
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
