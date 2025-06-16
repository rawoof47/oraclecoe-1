import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateCertification } from '../entities/candidate_certification.entity';
import { CreateCandidateCertificationsBulkDto } from '../candidate_certifications/dtos/create-candidate_certification.dto';

@Injectable()
export class CandidateCertificationsService {
  constructor(
    @InjectRepository(CandidateCertification)
    private candidateCertificationRepo: Repository<CandidateCertification>,
  ) {}

  async create(dto: CreateCandidateCertificationsBulkDto): Promise<CandidateCertification> {
    const cert = this.candidateCertificationRepo.create(dto);
    return await this.candidateCertificationRepo.save(cert);
  }

  async findAll(): Promise<CandidateCertification[]> {
    return await this.candidateCertificationRepo.find({
      relations: ['user', 'certification'],
    });
  }

  async findByUserId(user_id: string): Promise<CandidateCertification[]> {
    return await this.candidateCertificationRepo.find({
      where: { user_id },
      relations: ['certification'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.candidateCertificationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Certification with id ${id} not found`);
    }
  }

  async replaceCertifications(userId: string, certificationIds: string[]): Promise<CandidateCertification[]> {
    try {
      // ✅ Simple delete (no query runner)
      await this.candidateCertificationRepo.delete({ user_id: userId });

      // ✅ Prepare and save new certifications
      const newCerts = certificationIds.map(certId =>
        this.candidateCertificationRepo.create({
          user_id: userId,
          certification_id: certId,
        }),
      );

      return await this.candidateCertificationRepo.save(newCerts);
    } catch (error) {
      console.error('[CERT] Replacement Error:', error);
      throw new InternalServerErrorException('Failed to update certifications');
    }
  }
}
