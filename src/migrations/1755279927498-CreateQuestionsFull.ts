import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuestionsFull1755279927498 implements MigrationInterface {
    name = 'CreateQuestionsFull1755279927498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "questions" ("id" character varying NOT NULL, "country_code" character varying NOT NULL, "question" character varying NOT NULL, "options_json" jsonb NOT NULL, "correct_option_id" character varying NOT NULL, "explanation" text, "source_url_json" jsonb, "category" character varying NOT NULL, "difficulty" character varying NOT NULL, "time_limit_seconds" integer NOT NULL, "language" text, "tags_json" jsonb, "created_by" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL DEFAULT '1', "usage_count" integer NOT NULL DEFAULT '0', "correct_count" integer NOT NULL DEFAULT '0', "avg_response_ms" integer NOT NULL DEFAULT '0', "flag_count" integer NOT NULL DEFAULT '0', "review_status" character varying NOT NULL DEFAULT 'pending', CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "questions"`);
    }

}
