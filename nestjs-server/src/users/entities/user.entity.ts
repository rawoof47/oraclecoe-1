import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  middle_name?: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mobile_number?: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'char', length: 36 })
  role_id: string;

  @Column({ type: 'char', length: 36 })
  status_id: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  email_verified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'char', length: 36, nullable: true })
  created_by?: string;

  @Column({ type: 'char', length: 36, nullable: true })
  updated_by?: string;

  
}
