import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('content_moderation')
export class ContentModeration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  content_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  content_type?: string;

  @Column({ type: 'char', length: 36, nullable: true })
  flagged_by?: string;

  @Column({ type: 'char', length: 36, nullable: true })
  reviewed_by?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  reviewed_at?: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
