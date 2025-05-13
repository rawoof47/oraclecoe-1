import {
  Controller, Get, Post, Body, Param, Put, Delete
} from '@nestjs/common';
import { StatusCategoriesService } from './status-categories.service';
import { CreateStatusCategoryDto } from './dto/create-status-category.dto';
import { UpdateStatusCategoryDto } from './dto/update-status-category.dto';

@Controller('status-categories')
export class StatusCategoriesController {
  constructor(private readonly statusCategoriesService: StatusCategoriesService) {}

  @Post()
  create(@Body() dto: CreateStatusCategoryDto) {
    return this.statusCategoriesService.create(dto);
  }

  @Get()
  findAll() {
    return this.statusCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusCategoriesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStatusCategoryDto) {
    return this.statusCategoriesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusCategoriesService.remove(id);
  }
}
