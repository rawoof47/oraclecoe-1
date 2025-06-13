import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateCertificationsService } from './candidate_certifications.service';
import { CreateCandidateCertificationsBulkDto } from './dtos/create-candidate_certification.dto';

@Controller('candidate_certifications')
export class CandidateCertificationsController {
  constructor(
    private readonly candidateCertificationsService: CandidateCertificationsService,
  ) {}

  @Post()
  create(@Body() dto: CreateCandidateCertificationsBulkDto) {
    return this.candidateCertificationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.candidateCertificationsService.findAll();
  }

  @Get('user/:user_id')
  findByUser(@Param('user_id') userId: string) {
    return this.candidateCertificationsService.findByUserId(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateCertificationsService.remove(id);
  }

  @Post('bulk-replace')
  @UsePipes(new ValidationPipe({ transform: true }))
  bulkReplace(@Body() dto: CreateCandidateCertificationsBulkDto) {
    return this.candidateCertificationsService.replaceCertifications(
      dto.user_id,
      dto.certification_ids
    );
  }
}
