// src/applications/applications.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  // Create a new application
  async create(createApplicationDto: CreateApplicationDto) {
    const application = this.applicationRepository.create({
      candidate_id: createApplicationDto.candidate_id,
      job_id: createApplicationDto.job_id,
      application_status_id: createApplicationDto.status, // Maps to application_status_id
      withdrawn: createApplicationDto.withdrawn ?? false, // Defaults to false if not provided
      created_by: createApplicationDto.created_by ?? null,
      updated_by: createApplicationDto.updated_by ?? null,
    });
    return this.applicationRepository.save(application);
  }

  // Get all applications
  findAll() {
    return this.applicationRepository.find();
  }

  // Get a single application by ID
  async findOne(id: string) {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  // Update an existing application
  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (updateApplicationDto.job_id) {
      application.job_id = updateApplicationDto.job_id;
    }

    if (updateApplicationDto.candidate_id) {
      application.candidate_id = updateApplicationDto.candidate_id;
    }

    if (updateApplicationDto.status) {
      application.application_status_id = updateApplicationDto.status;
    }

    if (updateApplicationDto.withdrawn !== undefined) {
      application.withdrawn = updateApplicationDto.withdrawn;
    }

    if (updateApplicationDto.updated_by) {
      application.updated_by = updateApplicationDto.updated_by;
    }

    return this.applicationRepository.save(application);
  }

  // Remove an application by ID
  async remove(id: string) {
    const application = await this.applicationRepository.findOne({ where: { id } });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return this.applicationRepository.remove(application);
  }
}
