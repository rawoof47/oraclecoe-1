import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterLocation } from './recruiter-location.entity';
import { RecruiterLocationService } from './recruiter-location.service';
import { RecruiterLocationController } from './recruiter-location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecruiterLocation])],
  providers: [RecruiterLocationService],
  controllers: [RecruiterLocationController],
})
export class RecruiterLocationModule {}
