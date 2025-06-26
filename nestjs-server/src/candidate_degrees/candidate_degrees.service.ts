import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateDegree } from './entity/candidate-degree.entity';
import { CreateCandidateDegreeDto } from './dto/create-candidate_degree.dto';
import { UpdateCandidateDegreeDto } from './dto/update-candidate_degree.dto';

@Injectable()
export class CandidateDegreesService {
  constructor(
    @InjectRepository(CandidateDegree)
    private readonly candidateDegreeRepo: Repository<CandidateDegree>,
  ) {}

  async create(dto: CreateCandidateDegreeDto): Promise<CandidateDegree> {
    const entry = this.candidateDegreeRepo.create(dto);
    return this.candidateDegreeRepo.save(entry);
  }

  async findAll(): Promise<CandidateDegree[]> {
    return this.candidateDegreeRepo.find();
  }

  async findByUserId(userId: string): Promise<CandidateDegree[]> {
    return this.candidateDegreeRepo.find({
      where: { user_id: userId },
      relations: ['degree'], // Optional if you need degree details
    });
  }

  async update(id: string, dto: UpdateCandidateDegreeDto): Promise<CandidateDegree> {
    const degree = await this.candidateDegreeRepo.findOneBy({ id });
    if (!degree) {
      throw new NotFoundException(`CandidateDegree with ID ${id} not found`);
    }
    const updated = this.candidateDegreeRepo.merge(degree, dto);
    return this.candidateDegreeRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.candidateDegreeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CandidateDegree with ID ${id} not found`);
    }
  }

  async bulkReplace(user_id: string, degree_ids: string[]): Promise<void> {
  await this.candidateDegreeRepo.delete({ user_id });
  
  const entries = degree_ids.map((degree_id) =>
    this.candidateDegreeRepo.create({ user_id, degree_id })
  );
  
  await this.candidateDegreeRepo.save(entries);
}
}
