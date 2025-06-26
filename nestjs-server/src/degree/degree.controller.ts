import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { DegreeService } from './degree.service';
import { CreateDegreeDto, UpdateDegreeDto } from './dto';
import { Degree } from './entities/degree.entity';

@Controller('degrees')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Post()
  create(@Body() createDto: CreateDegreeDto): Promise<Degree> {
    return this.degreeService.create(createDto);
  }

  @Get()
  findAll(@Query('search') search?: string): Promise<Degree[]> {
    return this.degreeService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Degree> {
    return this.degreeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDegreeDto): Promise<Degree> {
    return this.degreeService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.degreeService.remove(id);
  }
}
