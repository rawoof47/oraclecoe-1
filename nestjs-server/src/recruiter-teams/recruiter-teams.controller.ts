import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecruiterTeamsService } from './recruiter-teams.service';
import { CreateRecruiterTeamDto } from './dto/create-recruiter-team.dto';
import { UpdateRecruiterTeamDto } from './dto/update-recruiter-team.dto';

@Controller('recruiter-teams')
export class RecruiterTeamsController {
  constructor(private readonly service: RecruiterTeamsService) {}

  @Post()
  create(@Body() dto: CreateRecruiterTeamDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecruiterTeamDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
