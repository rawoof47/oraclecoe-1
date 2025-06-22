import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobPostSkill } from 'src/job-post-skill/entities/job-post-skill.entity';
import { Application } from 'src/applications/entities/application.entity';

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

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string | null;

  @Column({
    type: 'enum',
    enum: ['Remote', 'On-site', 'Hybrid'],
    nullable: true,
  })
  work_mode: 'Remote' | 'On-site' | 'Hybrid' | null;

  @Column({ type: 'text', nullable: true })
  role_summary: string | null;

  @Column({ type: 'text', nullable: true })
  preferred_qualifications: string | null;

  @Column({ type: 'text', nullable: true })
  what_we_offer: string | null;

  @Column({ type: 'text', nullable: true })
  how_to_apply: string | null;

  @OneToMany(() => JobPostSkill, (jobPostSkill) => jobPostSkill.jobPost, {
    cascade: true,
  })
  jobPostSkills: JobPostSkill[];

  // ✅ NEW: Reverse relation for applications
  @OneToMany(() => Application, (application) => application.job_post)
  applications: Application[];

  @Column({ type: 'int', nullable: true, unique: true })
job_number: number | null;

}
