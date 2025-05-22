import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPostCertification } from './entities/job-post-certification.entity';

@Injectable()
export class JobPostCertificationsService {
  constructor(
    @InjectRepository(JobPostCertification)
    private readonly repo: Repository<JobPostCertification>,
  ) {}

  // ✅ Save certifications for a job post using separate parameters
  async saveCertifications(jobPostId: string, certificationIds: string[]) {
    const entries = certificationIds.map(certId =>
      this.repo.create({
        job_post_id: jobPostId,
        certification_id: certId,
      }),
    );
    return this.repo.save(entries);
  }

  // ✅ Replace certifications for a job post using separate parameters
  async replaceCertifications(jobPostId: string, certificationIds: string[]) {
    await this.repo.delete({ job_post_id: jobPostId });

    const entries = certificationIds.map(certId =>
      this.repo.create({
        job_post_id: jobPostId,
        certification_id: certId,
      }),
    );

    return this.repo.save(entries);
  }
}
