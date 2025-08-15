import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  google_sub!: string;

  @Column({ nullable: true })
  display_name?: string;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  country_hint?: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at!: Date;
}
