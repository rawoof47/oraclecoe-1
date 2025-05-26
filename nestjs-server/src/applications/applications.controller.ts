// src/applications/applications.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // Create a new application
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.create(createApplicationDto);
  }

  // Get all applications
  @Get()
  async findAll(): Promise<Application[]> {
    return this.applicationsService.findAll();
  }

  // Get one application by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationsService.findOne(id);
  }

  // Update application
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  // Delete application
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.applicationsService.remove(id);
  }
}
