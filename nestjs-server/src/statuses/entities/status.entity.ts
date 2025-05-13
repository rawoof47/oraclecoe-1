import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('statuses')
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'status_name', length: 100 })
  status_name: string;

  @Column({ name: 'status_category_id' })
  status_category_id: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
