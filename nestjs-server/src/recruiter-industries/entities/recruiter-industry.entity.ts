import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { RecruiterProfile } from '../../recruiter-profile/entity/recruiter-profile.entity';
import { Industry } from '../../industries/entities/industry.entity';

@Entity('recruiter_industries')
export class RecruiterIndustry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  user_id: string;

  @Column({ type: 'char', length: 36 })
  industry_id: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => RecruiterProfile, (profile) => profile.recruiterIndustries)
  @JoinColumn({ name: 'user_id' })
  user: RecruiterProfile;

  @ManyToOne(() => Industry)
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;
}
