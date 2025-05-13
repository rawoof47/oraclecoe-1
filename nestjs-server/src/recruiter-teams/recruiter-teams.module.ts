import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterTeamsService } from './recruiter-teams.service';
import { RecruiterTeamsController } from './recruiter-teams.controller';
import { RecruiterTeam } from './entities/recruiter-team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecruiterTeam])],
  controllers: [RecruiterTeamsController],
  providers: [RecruiterTeamsService],
})
export class RecruiterTeamsModule {}
