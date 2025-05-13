import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateSkill } from './entities/candidate-skill.entity';
import { CreateCandidateSkillDto } from './dto/create-candidate-skill.dto';
import { UpdateCandidateSkillDto } from './dto/update-candidate-skill.dto';

@Injectable()
export class CandidateSkillsService {
  constructor(
    @InjectRepository(CandidateSkill)
    private readonly candidateSkillRepository: Repository<CandidateSkill>,
  ) {}

  async create(createCandidateSkillDto: CreateCandidateSkillDto) {
    const candidateSkill = this.candidateSkillRepository.create(createCandidateSkillDto);
    return this.candidateSkillRepository.save(candidateSkill);
  }

  findAll() {
    return this.candidateSkillRepository.find();
  }

  async findOne(id: string) {
    const skill = await this.candidateSkillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException('Candidate skill not found');
    }
    return skill;
  }

  async update(id: string, updateDto: UpdateCandidateSkillDto) {
    const skill = await this.findOne(id);
    Object.assign(skill, updateDto);
    return this.candidateSkillRepository.save(skill);
  }

  async remove(id: string) {
    const skill = await this.findOne(id);
    return this.candidateSkillRepository.remove(skill);
  }
}
