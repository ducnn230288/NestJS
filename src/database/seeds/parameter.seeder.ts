import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Parameter } from '@entities';

export class ParameterSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Parameter);
    const listData: Parameter[] = [
      {
        code: 'address',
        vn: 'P3A.01.03, Picity High Park, 9A đường Thạnh ân 13, P. Thạnh Xuân, Q.12, TP. Hồ Chí Minh, Việt Nam.',
        en: '7 Cong Hoa St., Ward 4, Tan Binh Dist., Ho Chi Minh City, Vietnam.',
      },
      {
        code: 'email',
        vn: 'contact@ari.com.vn',
        en: 'contact@ari.com.vn',
      },
      {
        code: 'phone',
        vn: '(+84)363672405',
        en: '(+84)363672405',
      },
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
