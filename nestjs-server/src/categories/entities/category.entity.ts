import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories') // This ensures it's mapped to the 'categories' table
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  category_name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
