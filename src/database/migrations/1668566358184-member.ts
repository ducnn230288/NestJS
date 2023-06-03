import { MigrationInterface, QueryRunner } from 'typeorm';

export class member1669372347132 implements MigrationInterface {
  name = 'member1669372347132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "code_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "isPrimary" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_26e48b5ff442e5a476363c7c289" UNIQUE ("code"), CONSTRAINT "PK_aee67663d3bf78ece882e953afd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "message" character varying, "note" character varying, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "image" character varying, "image1" character varying, "image2" character varying, "image3" character varying, "order" integer, CONSTRAINT "PK_2533602bd9247937e3a4861e173" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "data_translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "slug" character varying, "seoTitle" character varying, "seoDescription" character varying, "text1" character varying, "text2" character varying, "text3" character varying, "content" jsonb NOT NULL DEFAULT '{}', "dataId" uuid NOT NULL, CONSTRAINT "PK_e48e7820fb4c959630441506fc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "data_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "isPrimary" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e407b5b8f08191a39e15c0559eb" UNIQUE ("code"), CONSTRAINT "PK_d7dc4348c702c83c5ff959dfaac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "day_off" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" integer NOT NULL, "status" integer NOT NULL DEFAULT '0', "reason" character varying, "time" integer NOT NULL, "timeNumber" real, "image" character varying, "dateLeaveStart" TIMESTAMP NOT NULL, "dateLeaveEnd" TIMESTAMP NOT NULL, "approvedAt" TIMESTAMP, "approvedById" uuid, "reasonReject" character varying, "staffId" uuid NOT NULL, "managerId" uuid, CONSTRAINT "PK_4ebe4c08c950e3dbc87f0249811" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "page" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "style" character varying, "order" integer, "mpath" character varying DEFAULT '', "parentId" uuid, CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "page_translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language" character varying NOT NULL, "title" character varying NOT NULL, "slug" character varying, "description" character varying, "image" character varying, "content" jsonb NOT NULL DEFAULT '[]', "pageId" uuid NOT NULL, CONSTRAINT "PK_340e2bad1120bcd4052ff02cc2e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "avatar" character varying, "password" character varying NOT NULL, "refreshToken" character varying, "resetPasswordToken" character varying, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "dob" TIMESTAMP NOT NULL, "description" character varying, "roleCode" character varying, "managerId" uuid, "positionCode" character varying, "startDate" TIMESTAMP NOT NULL, "dateLeave" real, "dateOff" real DEFAULT '0', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, "isSystemAdmin" boolean NOT NULL DEFAULT false, "permissions" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "UQ_00c232124015d4998bdc6036310" UNIQUE ("code"), CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "managerId" uuid, CONSTRAINT "PK_155dbc144ff2bd4713fdf1f6c77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_3aab60cbcf5684b4a89fb46147e" UNIQUE ("code"), CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_teams_user_team" ("userId" uuid NOT NULL, "userTeamId" uuid NOT NULL, CONSTRAINT "PK_673c99a7f0d4ea203b0b6bc251e" PRIMARY KEY ("userId", "userTeamId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_74cb5a61491f8722d90c376972" ON "user_teams_user_team" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_074b07e15f0ba9b81a75740b03" ON "user_teams_user_team" ("userTeamId") `);
    await queryRunner.query(
      `ALTER TABLE "data" ADD CONSTRAINT "FK_5411ba018172ec73e64e74bf5b0" FOREIGN KEY ("type") REFERENCES "data_type"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_translation" ADD CONSTRAINT "FK_eae311ec0c99d120558506acd05" FOREIGN KEY ("dataId") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "day_off" ADD CONSTRAINT "FK_a3474e339d2d6ab7f55076e48e5" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "day_off" ADD CONSTRAINT "FK_c2b584b7b7008a7cc4b60cb6318" FOREIGN KEY ("staffId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "day_off" ADD CONSTRAINT "FK_08670238291d69988dbf4902e39" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "page" ADD CONSTRAINT "FK_1c6d434d60b856dc8572e7b7b57" FOREIGN KEY ("parentId") REFERENCES "page"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_translation" ADD CONSTRAINT "FK_77745fe24fd6e85634c4ffabab9" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b823b9f2266b6a54de4e5b88294" FOREIGN KEY ("roleCode") REFERENCES "user_role"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_df69481de1f438f2082e4d54749" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_22188999bf0339b3fb2ff462aeb" FOREIGN KEY ("positionCode") REFERENCES "code"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_team" ADD CONSTRAINT "FK_1d03af227d451afbabb890b52fb" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "code" ADD CONSTRAINT "FK_927209d9e3f6f87ace1a933c978" FOREIGN KEY ("type") REFERENCES "code_type"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_teams_user_team" ADD CONSTRAINT "FK_74cb5a61491f8722d90c3769729" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_teams_user_team" ADD CONSTRAINT "FK_074b07e15f0ba9b81a75740b039" FOREIGN KEY ("userTeamId") REFERENCES "user_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_teams_user_team" DROP CONSTRAINT "FK_074b07e15f0ba9b81a75740b039"`);
    await queryRunner.query(`ALTER TABLE "user_teams_user_team" DROP CONSTRAINT "FK_74cb5a61491f8722d90c3769729"`);
    await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_927209d9e3f6f87ace1a933c978"`);
    await queryRunner.query(`ALTER TABLE "user_team" DROP CONSTRAINT "FK_1d03af227d451afbabb890b52fb"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_22188999bf0339b3fb2ff462aeb"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_df69481de1f438f2082e4d54749"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b823b9f2266b6a54de4e5b88294"`);
    await queryRunner.query(`ALTER TABLE "page_translation" DROP CONSTRAINT "FK_77745fe24fd6e85634c4ffabab9"`);
    await queryRunner.query(`ALTER TABLE "page" DROP CONSTRAINT "FK_1c6d434d60b856dc8572e7b7b57"`);
    await queryRunner.query(`ALTER TABLE "day_off" DROP CONSTRAINT "FK_08670238291d69988dbf4902e39"`);
    await queryRunner.query(`ALTER TABLE "day_off" DROP CONSTRAINT "FK_c2b584b7b7008a7cc4b60cb6318"`);
    await queryRunner.query(`ALTER TABLE "day_off" DROP CONSTRAINT "FK_a3474e339d2d6ab7f55076e48e5"`);
    await queryRunner.query(`ALTER TABLE "data_translation" DROP CONSTRAINT "FK_eae311ec0c99d120558506acd05"`);
    await queryRunner.query(`ALTER TABLE "data" DROP CONSTRAINT "FK_5411ba018172ec73e64e74bf5b0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_074b07e15f0ba9b81a75740b03"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_74cb5a61491f8722d90c376972"`);
    await queryRunner.query(`DROP TABLE "user_teams_user_team"`);
    await queryRunner.query(`DROP TABLE "code"`);
    await queryRunner.query(`DROP TABLE "user_team"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "page_translation"`);
    await queryRunner.query(`DROP TABLE "page"`);
    await queryRunner.query(`DROP TABLE "day_off"`);
    await queryRunner.query(`DROP TABLE "data_type"`);
    await queryRunner.query(`DROP TABLE "data_translation"`);
    await queryRunner.query(`DROP TABLE "data"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "code_type"`);
  }
}
