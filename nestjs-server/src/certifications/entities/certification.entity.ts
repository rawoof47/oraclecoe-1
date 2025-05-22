import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Entity('certifications')
export class Certification {
  @PrimaryColumn('char', { length: 36 })
  id: string; // UUID handled by DB

  @Column({ type: 'char', length: 36 })
  category_id: string;

  @ManyToOne(() => Category, (category) => category.certifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 150 })
  certification_name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
