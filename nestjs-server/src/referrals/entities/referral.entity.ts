import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  referrer_id: string;

  @Column()
  referral_code: string;

  @Column({ nullable: true })
  referred_user_id: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'int', default: 0 })
  clicks: number;

  @Column({ type: 'int', default: 0 })
  signups: number;

  @Column({ type: 'tinyint', default: 0 })
  converted: boolean;

  @Column({ type: 'int', default: 0 })
  points_awarded: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
