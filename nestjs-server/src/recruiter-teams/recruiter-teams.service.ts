import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruiterTeam } from './entities/recruiter-team.entity';
import { CreateRecruiterTeamDto } from './dto/create-recruiter-team.dto';
import { UpdateRecruiterTeamDto } from './dto/update-recruiter-team.dto';

@Injectable()
export class RecruiterTeamsService {
  constructor(
    @InjectRepository(RecruiterTeam)
    private readonly repo: Repository<RecruiterTeam>,
  ) {}

  create(dto: CreateRecruiterTeamDto): Promise<RecruiterTeam> {
    const team = this.repo.create(dto);
    return this.repo.save(team);
  }

  findAll(): Promise<RecruiterTeam[]> {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  findOne(id: string): Promise<RecruiterTeam> {
    return this.repo.findOneOrFail({ where: { id } });
  }

  async update(id: string, dto: UpdateRecruiterTeamDto): Promise<RecruiterTeam> {
    const team = await this.repo.findOneOrFail({ where: { id } });
    Object.assign(team, dto);
    return this.repo.save(team);
  }

  remove(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }
}
