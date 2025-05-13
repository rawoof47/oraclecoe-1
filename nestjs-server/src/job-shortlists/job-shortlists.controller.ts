import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { JobShortlistsService } from './job-shortlists.service';
import { CreateJobShortlistDto } from './dto/create-job-shortlist.dto';
import { UpdateJobShortlistDto } from './dto/update-job-shortlist.dto';

@Controller('job-shortlists')
export class JobShortlistsController {
  constructor(
    private readonly jobShortlistsService: JobShortlistsService,
  ) {}

  @Post()
  create(@Body() createJobShortlistDto: CreateJobShortlistDto) {
    return this.jobShortlistsService.create(createJobShortlistDto);
  }

  @Get()
  findAll() {
    return this.jobShortlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobShortlistsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobShortlistDto: UpdateJobShortlistDto) {
    return this.jobShortlistsService.update(id, updateJobShortlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobShortlistsService.remove(id);
  }
}
