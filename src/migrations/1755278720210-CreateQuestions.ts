import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuestions1755278720210 implements MigrationInterface {
    name = 'CreateQuestions1755278720210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "options" text array NOT NULL, "answer" character varying NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "question"`);
    }

}
