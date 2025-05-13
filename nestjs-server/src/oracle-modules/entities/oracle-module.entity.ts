import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('oracle_modules')
export class OracleModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  module_name: string;

  @Column()
  category_id: string;

  @Column({ nullable: true })
  status_id?: string;

  @Column({ nullable: true })
  created_by?: string;

  @Column({ nullable: true })
  updated_by?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
