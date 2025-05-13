import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobShortlistsService } from './job-shortlists.service';
import { JobShortlistsController } from './job-shortlists.controller';
import { JobShortlist } from './entities/job-shortlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobShortlist])],
  controllers: [JobShortlistsController],
  providers: [JobShortlistsService],
})
export class JobShortlistsModule {}
