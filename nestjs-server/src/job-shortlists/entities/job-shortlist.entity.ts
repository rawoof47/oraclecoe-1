import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('job_shortlists')
export class JobShortlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  job_id: string;

  @Column()
  recruiter_id: string;

  @Column()
  candidate_id: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('longtext', { nullable: true })
  labels: string;

  @Column('datetime', { nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('datetime', { nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
