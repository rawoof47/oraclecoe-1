import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsService],
  exports: [AwsService] // ✅ this makes it available to other modules
})
export class AwsModule {}
