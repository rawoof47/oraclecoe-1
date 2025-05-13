import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusCategoriesService } from './status-categories.service';
import { StatusCategoriesController } from './status-categories.controller';
import { StatusCategory } from './entities/status-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusCategory])],
  controllers: [StatusCategoriesController],
  providers: [StatusCategoriesService],
})
export class StatusCategoriesModule {}
