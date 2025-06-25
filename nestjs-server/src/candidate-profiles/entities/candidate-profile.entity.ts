import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('candidate_profiles')
export class CandidateProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  user_id: string;

  // ✅ Added gender field
  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  about_me: string;

  @Column({ type: 'text', nullable: true })
  professional_summary: string;

  @Column({ type: 'text', nullable: true })
  social_links: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resume_link: string;

  // ✅ Replaced education with year_of_passing
  @Column({ type: 'year', nullable: true })
  year_of_passing: number;

  // ✅ Added university as free text
  @Column({ type: 'varchar', length: 255, nullable: true })
  university: string;

  // ✅ Added grade/percentage
  @Column({ type: 'varchar', length: 20, nullable: true })
  grade_or_percentage: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  experience_years: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  notice_period: string;

  @Column({ type: 'char', length: 36, nullable: true })
  status_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string;
}
