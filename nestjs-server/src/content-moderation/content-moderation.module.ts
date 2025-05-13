import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentModerationService } from './content-moderation.service';
import { ContentModerationController } from './content-moderation.controller';
import { ContentModeration } from './entities/content-moderation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentModeration])],
  controllers: [ContentModerationController],
  providers: [ContentModerationService],
})
export class ContentModerationModule {}
