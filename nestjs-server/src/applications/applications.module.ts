// src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity';
import { CandidateProfile } from 'src/candidate-profiles/entities/candidate-profile.entity'; // ✅ Import candidate profile entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, CandidateProfile]), // ✅ Include both repositories
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
