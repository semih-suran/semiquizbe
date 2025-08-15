import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryColumn()
  id!: string; // From JSON, e.g. usa_q078

  @Column()
  country_code!: string;

  @Column()
  question!: string;

  @Column('jsonb')
  options_json!: any;

  @Column()
  correct_option_id!: string;

  @Column({ type: 'text', nullable: true })
  explanation!: string | null;

  @Column('jsonb', { nullable: true })
  source_url_json!: string[] | null;

  @Column()
  category!: string;

  @Column()
  difficulty!: string;

  @Column()
  time_limit_seconds!: number;

  @Column({ type: 'text', nullable: true })
  language!: string | null;

  @Column('jsonb', { nullable: true })
  tags_json!: string[] | null;

  @Column({ type: 'text', nullable: true })
  created_by!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ default: 1 })
  version!: number;

  @Column({ default: 0 })
  usage_count!: number;

  @Column({ default: 0 })
  correct_count!: number;

  @Column({ default: 0 })
  avg_response_ms!: number;

  @Column({ default: 0 })
  flag_count!: number;

  @Column({ default: 'pending' })
  review_status!: string;
}
