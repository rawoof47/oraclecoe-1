import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { Degree } from './entities/degree.entity';
@Injectable()
export class DegreeService {
  constructor(
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
  ) {}

  async create(createDto: CreateDegreeDto): Promise<Degree> {
    const degree = this.degreeRepository.create(createDto);
    return this.degreeRepository.save(degree);
  }

  async findAll(search?: string): Promise<Degree[]> {
    if (search) {
      return this.degreeRepository.find({
        where: [
          { name: ILike(`%${search}%`) },
          { abbreviation: ILike(`%${search}%`) },
          { keywords: ILike(`%${search}%`) },
        ],
        order: { name: 'ASC' },
      });
    }

    return this.degreeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Degree> {
    const degree = await this.degreeRepository.findOneBy({ id });
    if (!degree) {
      throw new NotFoundException(`Degree with ID ${id} not found`);
    }
    return degree;
  }

  async update(id: string, updateDto: UpdateDegreeDto): Promise<Degree> {
    const degree = await this.findOne(id);
    const updated = this.degreeRepository.merge(degree, updateDto);
    return this.degreeRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.degreeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Degree with ID ${id} not found`);
    }
  }
}
