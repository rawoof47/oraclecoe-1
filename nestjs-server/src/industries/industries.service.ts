import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Industry } from './entities/industry.entity';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@Injectable()
export class IndustriesService {
  constructor(
    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,
  ) {}

  // ✅ Create a new industry
  async create(createIndustryDto: CreateIndustryDto): Promise<Industry> {
    const newIndustry = this.industryRepository.create(createIndustryDto);
    return this.industryRepository.save(newIndustry);
  }

  // ✅ Get all industries
  async findAll(): Promise<Industry[]> {
    return this.industryRepository.find();
  }

  // ✅ Get one industry by ID
  async findOne(id: string): Promise<Industry | null> {
    return this.industryRepository.findOne({ where: { id } });
  }

  // ✅ Update industry by ID
  async update(id: string, updateIndustryDto: UpdateIndustryDto): Promise<Industry | null> {
    const industry = await this.findOne(id);
    if (!industry) return null;

    const updated = Object.assign(industry, updateIndustryDto);
    return this.industryRepository.save(updated);
  }

  // ✅ Delete industry by ID
  async remove(id: string): Promise<void> {
    await this.industryRepository.delete(id);
  }
}
