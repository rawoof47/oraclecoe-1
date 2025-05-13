import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('api_access_tokens')
@Unique(['token'])
export class ApiAccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  token: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  label: string;

  @Column({ type: 'int', default: 1000 })
  usage_limit: number;

  @Column({ type: 'int', default: 0 })
  usage_count: number;

  @Column({ type: 'datetime', nullable: true })
  expires_at: Date;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
