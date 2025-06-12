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
import { CandidateSkillsService } from './candidate-skills.service';
import { CreateCandidateSkillsBulkDto } from './dto/create-candidate-skill.dto';

@Controller('candidate_skills')
export class CandidateSkillsController {
  constructor(
    private readonly candidateSkillsService: CandidateSkillsService,
  ) {}

  @Post()
  create(@Body() dto: CreateCandidateSkillsBulkDto) {
    return this.candidateSkillsService.create(dto);
  }

  @Get()
  findAll() {
    return this.candidateSkillsService.findAll();
  }

  @Get('user/:user_id')
  findByUser(@Param('user_id') userId: string) {
    return this.candidateSkillsService.findByUserId(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateSkillsService.remove(id);
  }

  @Post('bulk-replace')
  @UsePipes(new ValidationPipe({ transform: true })) // ✅ Validation enabled
  bulkReplaceSkills(@Body() dto: CreateCandidateSkillsBulkDto) {
    return this.candidateSkillsService.replaceSkills(
      dto.user_id,
      dto.skill_ids,
    );
  }
}
