import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Certification } from 'src/certifications/entities/certification.entity'; // Adjust the path as needed

@Entity('job_post_certifications')
export class JobPostCertification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  job_post_id: string;

  @Column({ type: 'char', length: 36 })
  certification_id: string;

  @ManyToOne(() => Certification, { eager: true }) // Eager fetch ensures data is loaded automatically
  @JoinColumn({ name: 'certification_id' })
  certification: Certification;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
