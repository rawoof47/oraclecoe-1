import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobPost } from 'src/job-posts/entities/job-post.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  candidate_id: string;

  @Column({ type: 'char', length: 36 })
  job_id: string;

  @Column({ type: 'char', length: 36, nullable: true })
  application_status_id: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'applied_on',
    default: () => 'CURRENT_TIMESTAMP',
  })
  applied_on: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_on',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_on: Date;

  @Column({ type: 'tinyint', width: 1, default: () => '0' })
  withdrawn: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  withdrawal_reason: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string | null;

  // ✅ Relation to job_post for JOINs in queries
  @ManyToOne(() => JobPost, (jobPost) => jobPost.applications, { eager: false })
  @JoinColumn({ name: 'job_id' })
  job_post: JobPost;
}
