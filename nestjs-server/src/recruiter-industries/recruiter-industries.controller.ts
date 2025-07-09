import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecruiterIndustriesService } from './recruiter-industries.service';
import { CreateRecruiterIndustryDto } from './dto/create-recruiter-industry.dto';
import { UpdateRecruiterIndustryDto } from './dto/update-recruiter-industry.dto';

@Controller('recruiter-industries')
export class RecruiterIndustriesController {
  constructor(private readonly recruiterIndustriesService: RecruiterIndustriesService) {}

  @Post()
  create(@Body() createRecruiterIndustryDto: CreateRecruiterIndustryDto) {
    return this.recruiterIndustriesService.create(createRecruiterIndustryDto);
  }

  @Get()
  findAll() {
    return this.recruiterIndustriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recruiterIndustriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecruiterIndustryDto: UpdateRecruiterIndustryDto) {
    return this.recruiterIndustriesService.update(+id, updateRecruiterIndustryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recruiterIndustriesService.remove(+id);
  }
}
