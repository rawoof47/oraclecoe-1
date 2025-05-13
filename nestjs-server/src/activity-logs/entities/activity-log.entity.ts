import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryColumn('char', { length: 36 })
  id: string; // Will be manually set or auto-generated in DB with uuid()

  @Column('char', { length: 36 })
  user_id: string;

  @Column({ type: 'varchar', length: 100 })
  action_type: string;

  @Column({ type: 'longtext', nullable: true })
  metadata: string | null;

  @Column({ type: 'int', default: 0 })
  points_awarded: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
