import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity'; // <-- Make sure the path is correct

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // <-- Register entity
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
