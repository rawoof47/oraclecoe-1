import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusCategory } from './entities/status-category.entity';
import { CreateStatusCategoryDto } from './dto/create-status-category.dto';
import { UpdateStatusCategoryDto } from './dto/update-status-category.dto';

@Injectable()
export class StatusCategoriesService {
  constructor(
    @InjectRepository(StatusCategory)
    private readonly statusCategoryRepo: Repository<StatusCategory>,
  ) {}

  create(dto: CreateStatusCategoryDto) {
    const newCategory = this.statusCategoryRepo.create(dto);
    return this.statusCategoryRepo.save(newCategory);
  }

  findAll() {
    return this.statusCategoryRepo.find();
  }

  async findOne(id: string) {
    const category = await this.statusCategoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`StatusCategory with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdateStatusCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.statusCategoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return this.statusCategoryRepo.remove(category);
  }
}
