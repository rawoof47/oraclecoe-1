import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CandidateCertificationsService } from '../candidate_certifications/candidate_certifications.service';
import { CreateCandidateCertificationDto } from '../dto/create-candidate_certification.dto';
import { UpdateCandidateCertificationDto } from '../dto/update-candidate_certification.dto';
import { CreateCandidateCertificationsBulkDto } from '../candidate_certifications/dtos/create-candidate_certification.dto';

@Controller('candidate-certifications')
export class CandidateCertificationsController {
  constructor(
    private readonly candidateCertificationsService: CandidateCertificationsService,
  ) {}

  @Post()
  create(
    @Body()
    createCandidateCertificationDto: CreateCandidateCertificationDto,
  ) {
    return this.candidateCertificationsService.create(
      createCandidateCertificationDto,
    );
  }

  @Get()
  findAll() {
    return this.candidateCertificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidateCertificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateCandidateCertificationDto: UpdateCandidateCertificationDto,
  ) {
    return this.candidateCertificationsService.update(
      +id,
      updateCandidateCertificationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateCertificationsService.remove(+id);
  }

  @Post('bulk-replace')
  @UsePipes(new ValidationPipe())
  bulkReplaceCertifications(
    @Body() dto: CreateCandidateCertificationsBulkDto,
  ) {
    return this.candidateCertificationsService.replaceCertifications(
      dto.user_id,
      dto.certification_ids,
    );
  }
}
