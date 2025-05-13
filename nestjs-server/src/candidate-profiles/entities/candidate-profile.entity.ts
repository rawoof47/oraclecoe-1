import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('candidate_profiles')
export class CandidateProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  user_id: string;

  @Column({ type: 'char', length: 36, nullable: true })
  status_id: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location: string | null;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  experience_years: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  notice_period: string | null;

  @Column({ type: 'tinyint', width: 1, default: () => '0' })
  remote_preference: boolean;

  @Column({ type: 'text', nullable: true })
  resume_url: string | null;

  @Column({ type: 'text', nullable: true })
  profile_photo_url: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string | null;
}
