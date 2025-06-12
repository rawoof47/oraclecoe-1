// src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity';
import { CandidateProfile } from 'src/candidate-profiles/entities/candidate-profile.entity'; // ✅ Import candidate profile entity
import { UserModule } from 'src/users/users.module'; // ✅ Import UsersModule
import { User } from 'src/users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Application, CandidateProfile, User, UserModule]), // ✅ Include both repositories
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
