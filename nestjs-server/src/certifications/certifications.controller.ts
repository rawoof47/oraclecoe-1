import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import { CreateCertificationDto } from './dto/create-certification.dto';

@Controller('certifications')
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Post()
  create(@Body() dto: CreateCertificationDto) {
    return this.certificationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.certificationsService.findAll();
  }

  @Get('by-category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.certificationsService.findByCategory(categoryId);
  }

  @Post('save')
  saveCertifications(@Body() body: { jobPostId: string; certificationIds: string[] }) {
    return this.certificationsService.saveCertifications(body.jobPostId, body.certificationIds);
  }

  // ✅ Optional: Get certifications by list of IDs
  @Post('by-ids')
  findByIds(@Body() body: { ids: string[] }) {
    return this.certificationsService.findByIds(body.ids);
  }

  
}
