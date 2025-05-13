import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  create(createStatusDto: CreateStatusDto) {
    const status = this.statusRepository.create(createStatusDto);
    return this.statusRepository.save(status);
  }

  findAll() {
    return this.statusRepository.find();
  }

  async findOne(id: string) {
    const status = await this.statusRepository.findOne({ where: { id } });
    if (!status) throw new NotFoundException('Status not found');
    return status;
  }

  async update(id: string, updateStatusDto: UpdateStatusDto) {
    const status = await this.statusRepository.preload({
      id,
      ...updateStatusDto,
    });
    if (!status) throw new NotFoundException('Status not found');
    return this.statusRepository.save(status);
  }

  async remove(id: string) {
    const status = await this.findOne(id);
    return this.statusRepository.remove(status);
  }
}
