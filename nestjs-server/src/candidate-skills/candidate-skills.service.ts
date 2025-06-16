import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateSkill } from './entities/candidate-skill.entity';
import { CreateCandidateSkillsBulkDto } from './dto/create-candidate-skill.dto';
import { UpdateCandidateSkillDto } from './dto/update-candidate-skill.dto';

@Injectable()
export class CandidateSkillsService {
  constructor(
    @InjectRepository(CandidateSkill)
    private candidateSkillRepo: Repository<CandidateSkill>,
  ) {}

  async create(dto: CreateCandidateSkillsBulkDto): Promise<CandidateSkill> {
    const skill = this.candidateSkillRepo.create(dto);
    return await this.candidateSkillRepo.save(skill);
  }

  async findAll(): Promise<CandidateSkill[]> {
    return await this.candidateSkillRepo.find({
      relations: ['user', 'skill'],
    });
  }

  async findByUserId(user_id: string): Promise<CandidateSkill[]> {
    return await this.candidateSkillRepo.find({
      where: { user_id },
      relations: ['skill'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.candidateSkillRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CandidateSkill with id ${id} not found`);
    }
  }

  async replaceSkills(userId: string, skillIds: string[]): Promise<CandidateSkill[]> {
    const queryRunner = this.candidateSkillRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    console.log('[SKILL] Starting replacement for user:', userId);
    console.log('[SKILL] New skills:', skillIds);

    try {
      // Delete existing skills
      const deleteResult = await queryRunner.manager.delete(CandidateSkill, { user_id: userId });
      console.log(`[SKILL] Deleted ${deleteResult.affected} records`);

      // Create and save new skills
      const newSkills = skillIds.map(skillId =>
        this.candidateSkillRepo.create({ user_id: userId, skill_id: skillId })
      );

      const savedSkills = await queryRunner.manager.save(CandidateSkill, newSkills);
      console.log('[SKILL] Saved new skills:', savedSkills);

      await queryRunner.commitTransaction();
      return savedSkills;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('[SKILL] Replacement Error:', error);
      throw new InternalServerErrorException('Failed to update skills');
    } finally {
      await queryRunner.release();
    }
  }
  async findSkillsByUserId(user_id: string): Promise<string[]> {
  const candidateSkills = await this.candidateSkillRepo.find({
    where: { user_id },
    relations: ['skill'],
  });
  return candidateSkills.map(cs => cs.skill.name);
}
}
