// import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
//
// @Entity()
// export abstract class BaseHistory<T extends BaseHistory = any> {
//   constructor(partial: Partial<T> = {}) {
//     Object.assign(this, partial);
//   }
//
//   @PrimaryGeneratedColumn('uuid')
//   @IsUUID()
//   id?: string;
//
//   @Column()
//   @IsUUID()
//   public originalID: string;
//
//   @Column()
//   @IsString()
//   public action: string;
//
//   @CreateDateColumn({ name: 'created_at' })
//   @IsDateString()
//   @IsOptional()
//   readonly createdAt?: Date;
// }
