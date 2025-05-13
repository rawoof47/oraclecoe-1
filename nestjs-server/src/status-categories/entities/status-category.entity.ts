import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('status_categories')
export class StatusCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_name', unique: true })
  categoryName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
