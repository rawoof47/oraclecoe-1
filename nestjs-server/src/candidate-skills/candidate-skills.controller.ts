import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CandidateSkillsService } from './candidate-skills.service';
import { CreateCandidateSkillDto } from './dto/create-candidate-skill.dto';
import { UpdateCandidateSkillDto } from './dto/update-candidate-skill.dto';

@Controller('candidate-skills')
export class CandidateSkillsController {
  constructor(private readonly candidateSkillsService: CandidateSkillsService) {}

  @Post()
  create(@Body() createCandidateSkillDto: CreateCandidateSkillDto) {
    return this.candidateSkillsService.create(createCandidateSkillDto);
  }

  @Get()
  findAll() {
    return this.candidateSkillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidateSkillsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidateSkillDto: UpdateCandidateSkillDto,
  ) {
    return this.candidateSkillsService.update(id, updateCandidateSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateSkillsService.remove(id);
  }
}
