import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recruiter_teams')
export class RecruiterTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @Column()
  team_name: string;

  @Column({ type: 'longtext', nullable: true })
  members: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
