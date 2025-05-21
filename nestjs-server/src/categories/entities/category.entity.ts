import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Skill } from 'src/skills/entities/skill.entity';

@Entity('categories') // This ensures it's mapped to the 'categories' table
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  category_name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

   @OneToMany(() => Skill, (skill) => skill.category)

  skills: Skill[];
}
