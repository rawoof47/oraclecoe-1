// training/training.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { Training } from './entities/training.entity';

@Controller('trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {
    console.log('✅ TrainingController loaded');
  }

  @Post()
  async create(@Body() dto: CreateTrainingDto): Promise<Training> {
    return this.trainingService.createTraining(dto);
  }
}
