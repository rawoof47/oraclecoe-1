import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reward_points')
export class RewardPoints {
  @PrimaryColumn({ type: 'char', length: 36 })
  user_id: string;

  @Column({ type: 'int', default: 0 })
  total_points: number;

  @Column({ type: 'int', default: 0 })
  lifetime_points: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  last_updated: Date;
}
