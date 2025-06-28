import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RecruiterIndustry } from '../../recruiter-industries/entities/recruiter-industry.entity';
import { RecruiterLocation } from '../../recruiter-location/recruiter-location.entity';

@Entity('recruiter_profiles')
export class RecruiterProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  user_id: string;

  @Column({ length: 255 })
  company_name: string;

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

  // 🆕 One-to-many relation with recruiter_industries table
  @OneToMany(() => RecruiterIndustry, (ri) => ri.profile)
  recruiterIndustries: RecruiterIndustry[];

  // 🆕 Transient property for returning just industry IDs
  industries?: string[];

  // ✅ NEW: Optional city/state field
  @Column({ name: 'city_state', type: 'varchar', length: 255, nullable: true })
  city_state?: string;

  // ✅ NEW: One-to-many relation with recruiter_locations
 @OneToMany(() => RecruiterLocation, (location) => location.recruiterProfile)
locations: RecruiterLocation[];

}
