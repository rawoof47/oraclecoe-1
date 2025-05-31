import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Certification } from './entities/certification.entity';
import { JobPostCertification } from '../job-post-certification/entities/job-post-certification.entity';
import { CreateCertificationDto } from './dto/create-certification.dto';

@Injectable()
export class CertificationsService {
  constructor(
    @InjectRepository(Certification)
    private readonly certificationRepository: Repository<Certification>,

    @InjectRepository(JobPostCertification)
    private readonly jobPostCertRepo: Repository<JobPostCertification>,
  ) {}

  /**
   * ✅ Create a new certification
   */
  create(dto: CreateCertificationDto) {
    const cert = this.certificationRepository.create(dto);
    return this.certificationRepository.save(cert);
  }

  /**
   * ✅ Get all certifications
   */
  findAll() {
    return this.certificationRepository.find();
  }

  /**
   * ✅ Get certifications by category
   */
  findByCategory(categoryId: string) {
    return this.certificationRepository.find({
      where: { category_id: categoryId },
    });
  }

  /**
   * ✅ Save selected certifications for a job post
   */
  async saveCertifications(jobPostId: string, certificationIds: string[]) {
    const entities = certificationIds.map(certId => {
      return this.jobPostCertRepo.create({
        job_post_id: jobPostId,
        certification_id: certId,
      });
    });

    await this.jobPostCertRepo.save(entities);

    return {
      message: 'Certifications saved successfully',
      data: entities,
    };
  }

  /**
   * ✅ Get certifications by array of IDs (for frontend display)
   */
  async findByIds(ids: string[]) {
    if (!ids || ids.length === 0) {
      return [];
    }

    return this.certificationRepository.find({
      where: { id: In(ids) },
    });
  }
}
