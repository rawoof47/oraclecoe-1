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
import { User } from 'src/users/entities/user.entity';
import { CandidateProfile } from 'src/candidate-profiles/entities/candidate-profile.entity';

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

  @CreateDateColumn({ name: 'applied_on' })
  applied_on: Date;

  @UpdateDateColumn({ name: 'updated_on' })
  updated_on: Date;

  @Column({ type: 'tinyint', width: 1, default: () => '0' })
  withdrawn: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  withdrawal_reason: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string | null;

  // ✅ Join with job post
  @ManyToOne(() => JobPost, (jobPost) => jobPost.applications, { eager: false })
  @JoinColumn({ name: 'job_id' })
  job_post: JobPost;

  // ✅ Join with user (basic candidate info)
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'candidate_id' })
  candidate: User;

  // ✅ Join with candidate profile (extended info)
  @ManyToOne(() => CandidateProfile, { eager: false })
  @JoinColumn({ name: 'candidate_id', referencedColumnName: 'user_id' })
  candidate_profile: CandidateProfile;
}
