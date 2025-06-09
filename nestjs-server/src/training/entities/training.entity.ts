// training/entities/training.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('training')
export class Training {
  @PrimaryGeneratedColumn()
  training_id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['online', 'offline', 'hybrid'],
  })
  mode: 'online' | 'offline' | 'hybrid';

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'date' })
  registration_deadline: string;

  @Column('decimal', { precision: 10, scale: 2 })
  fee: number;

  @Column({ type: 'int' })
  batch_size: number;


  @Column({ type: 'varchar', length: 50, nullable: true })
  duration?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  trainer?: string;

  @Column({ type: 'text', nullable: true })
  modules?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'completed', 'cancelled'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'completed' | 'cancelled';

  @Column({ type: 'varchar', length: 512, nullable: true })
  pdf_url?: string;

  @Column({ nullable: true })
  created_by?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // ✅ New Fields:
  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'enum', enum: ['technical', 'functional', 'integration'] })
  training_type: 'technical' | 'functional' | 'integration';

  @Column({ nullable: true, length: 512 })
  external_link: string;

  @Column({ type: 'json', nullable: true })
  features?: string[]; // e.g., ["job_support", "certification", "project"]

}

