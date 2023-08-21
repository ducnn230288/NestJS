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
import { Post } from '../entities/post.entity';
import { PostTranslation } from '../entities/post-translation.entity';
import { PostType } from '../entities/post-type.entity';
import { MainSeeder } from './main.seeder';
import { member1669372347132 } from './migrations/1668566358184-member';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'lctiendat',
  database: process.env.DATABASE_NAME || 'postgres',
  entities: [Code, CodeType, User, UserRole, Data, DataTranslation, DataType, Post, PostTranslation, PostType],
  migrations: [member1669372347132],
  seeds: [MainSeeder],
};
export const AppDataSource = new DataSource(options);
