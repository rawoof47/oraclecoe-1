import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'; // Add this import
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@ApiTags('industries') // Add this decorator
@Controller('industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  // ✅ Create a new industry
  @Post()
  create(@Body() createIndustryDto: CreateIndustryDto) {
    return this.industriesService.create(createIndustryDto);
  }

  // ✅ Get all industries
  @Get()
  findAll() {
    return this.industriesService.findAll();
  }

  // ✅ Get a single industry by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.industriesService.findOne(id);
  }

  // ✅ Update an industry by ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIndustryDto: UpdateIndustryDto) {
    return this.industriesService.update(id, updateIndustryDto);
  }

  // ✅ Delete an industry by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.industriesService.remove(id);
  }
}
