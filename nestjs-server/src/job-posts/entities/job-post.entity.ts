import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('job_posts')
export class JobPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  recruiter_id: string;

  @Column({ type: 'varchar', length: 200 })
  job_title: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location: string | null;

  @Column({ type: 'longtext', nullable: true })
  modules_required: string | null;

  @Column({ type: 'longtext', nullable: true })
  skills_required: string | null;

  @Column({ type: 'longtext', nullable: true })
  certifications_required: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  experience_min: number | null;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  experience_max: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  employment_type: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  compensation_range: string | null;

  @Column({ type: 'text', nullable: true })
  job_description: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  notice_period: string | null;

  @Column({ type: 'char', length: 36 })
  status_id: string;

  @Column({ type: 'date', nullable: true })
  application_deadline: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string | null;
}
