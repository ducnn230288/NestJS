import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { DataType } from '@entities';

export class DataTypeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(DataType);
    const listData: DataType[] = [
      { name: 'Mission', code: 'MISSION', isPrimary: true },
      { name: 'Services', code: 'SERVICES', isPrimary: true },
      { name: 'Value', code: 'VALUE', isPrimary: true },
      { name: 'Member', code: 'MEMBER', isPrimary: true },
      { name: 'Partner', code: 'PARTNER', isPrimary: true },
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

    // const userFactory = await factoryManager.get(CategoryType);
    // await userFactory.save();
    // await userFactory.saveMany(5);
  }
}
