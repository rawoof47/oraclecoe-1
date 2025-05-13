import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from './entities/referral.entity';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(Referral)
    private readonly repo: Repository<Referral>,
  ) {}

  create(dto: CreateReferralDto): Promise<Referral> {
    const referral = this.repo.create(dto);
    return this.repo.save(referral);
  }

  findAll(): Promise<Referral[]> {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  findOne(id: string): Promise<Referral> {
    return this.repo.findOneOrFail({ where: { id } });
  }

  async update(id: string, dto: UpdateReferralDto): Promise<Referral> {
    const referral = await this.repo.findOneOrFail({ where: { id } });
    Object.assign(referral, dto);
    return this.repo.save(referral);
  }

  remove(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }
}
