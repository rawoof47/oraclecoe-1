import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';

import { CandidateCertification } from '../entities/candidate_certification.entity';
import { CreateCandidateCertificationDto } from '../dto/create-candidate_certification.dto';
import { UpdateCandidateCertificationDto } from '../dto/update-candidate_certification.dto';
import { CreateCandidateCertificationsBulkDto } from '../candidate_certifications/dtos/create-candidate_certification.dto';

@Injectable()
export class CandidateCertificationsService {
  constructor(
    @InjectRepository(CandidateCertification)
    private candidateCertificationRepo: Repository<CandidateCertification>,
    private connection: Connection,
  ) {}

  async create(
    createDto: CreateCandidateCertificationDto,
  ): Promise<CandidateCertification> {
    const cert = this.candidateCertificationRepo.create(createDto);
    return await this.candidateCertificationRepo.save(cert);
  }

  async findAll(): Promise<CandidateCertification[]> {
    return await this.candidateCertificationRepo.find({
      relations: ['user', 'certification'],
    });
  }

  async findOne(id: number): Promise<CandidateCertification> {
    const cert = await this.candidateCertificationRepo.findOne({
      where: { id },
      relations: ['user', 'certification'],
    });

    if (!cert) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }

    return cert;
  }

  async update(
    id: number,
    updateDto: UpdateCandidateCertificationDto,
  ): Promise<CandidateCertification> {
    await this.candidateCertificationRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.candidateCertificationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
  }

  async replaceCertifications(
    userId: string,
    certificationIds: string[],
  ): Promise<CandidateCertification[]> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    console.log('[CERT] Starting replacement for user:', userId);
    console.log('[CERT] New certifications:', certificationIds);

    try {
      // Delete existing certifications
      const deleteResult = await queryRunner.manager.delete(CandidateCertification, {
        user_id: userId,
      });
      console.log(`[CERT] Deleted ${deleteResult.affected} records`);

      // Create new certification entries
      const newCerts = certificationIds.map(certification_id =>
        this.candidateCertificationRepo.create({
          user_id: userId,
          certification_id,
        }),
      );

      const savedCerts = await queryRunner.manager.save(
        CandidateCertification,
        newCerts,
      );
      console.log('[CERT] Saved new certifications:', savedCerts);

      await queryRunner.commitTransaction();
      return savedCerts;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('[CERT] Replacement Error:', error);
      throw new InternalServerErrorException('Failed to update certifications');
    } finally {
      await queryRunner.release();
    }
  }
}
