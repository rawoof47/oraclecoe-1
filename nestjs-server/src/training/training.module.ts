// training/training.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { Training } from './entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training])],
  controllers: [TrainingController],
  providers: [TrainingService],
})
export class TrainingModule {}
