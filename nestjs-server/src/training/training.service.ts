// training/training.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Training } from './entities/training.entity';
import { CreateTrainingDto } from './dto/create-training.dto';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Training)
    private trainingRepository: Repository<Training>,
  ) {}

  async createTraining(dto: CreateTrainingDto): Promise<Training> {
    const training = this.trainingRepository.create(dto);
    return this.trainingRepository.save(training);
  }
}
