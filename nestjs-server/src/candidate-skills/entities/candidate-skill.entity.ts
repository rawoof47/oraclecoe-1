import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('candidate_skills')
export class CandidateSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  candidate_id: string;

  @Column({ type: 'char', length: 36 })
  module_id: string;

  @Column({ type: 'char', length: 36, nullable: true })
  verification_status_id: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  proficiency: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  years_experience: number | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string | null;
}
