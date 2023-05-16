import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { Code } from '../entities/code.entity';
import { CodeType } from '../entities/code-type.entity';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { Data } from '../entities/data.entity';
import { DataTranslation } from '../entities/data-translation.entity';
import { DataType } from '../entities/data-type.entity';
import { Page } from '../entities/page.entity';
import { PageTranslation } from '../entities/page-translation.entity';
import { MainSeeder } from './main.seeder';
import { member1669372347132 } from './migrations/1668566358184-member';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Code, CodeType, User, UserRole, Data, DataTranslation, DataType, Page, PageTranslation],
  migrations: [member1669372347132],
  seeds: [MainSeeder],
};
export const AppDataSource = new DataSource(options);
