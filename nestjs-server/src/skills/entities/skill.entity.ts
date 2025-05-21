import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { JobPostSkill } from 'src/job-post-skill/entities/job-post-skill.entity';

@Entity('skills')
export class Skill {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'char', length: 36 })
  category_id: string;

  @ManyToOne(() => Category, (category) => category.skills, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => JobPostSkill, (jobPostSkill) => jobPostSkill.skill)
  jobPostSkills: JobPostSkill[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
