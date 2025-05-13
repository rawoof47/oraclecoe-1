import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_badges')
export class UserBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  badge_id: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  earned_on: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source_action: string;
}
