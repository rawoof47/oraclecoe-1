import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('recruiter_profiles')
export class RecruiterProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  user_id: string;

  @Column({ length: 255 })
  company_name: string;

  @Column({ length: 100, nullable: true })
  industry: string;

  @Column({ length: 50, nullable: true })
  company_size: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  company_description: string;

  @Column({ length: 100, nullable: true })
  recruiter_position: string;

  @Column({ type: 'char', length: 36, nullable: true })
  status_id: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by: string;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by: string;
}
