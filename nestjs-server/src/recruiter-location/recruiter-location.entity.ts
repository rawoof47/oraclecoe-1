import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Region } from '../regions/region.entity';
import { Country } from '../countries/country.entity';
import { RecruiterProfile } from '../recruiter-profile/entity/recruiter-profile.entity';

@Entity('recruiter_locations')
export class RecruiterLocation {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'char', length: 36 })
  recruiter_profile_id: string;

  @Column({ type: 'char', length: 36 })
  region_id: string;

  @Column({ type: 'char', length: 36, nullable: true })
  country_id: string | null;

  @ManyToOne(() => RecruiterProfile)
  @JoinColumn({ name: 'recruiter_profile_id' })
  recruiterProfile: RecruiterProfile;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
