// src/api-access-tokens/api-access-tokens.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiAccessTokensService } from './api-access-tokens.service';
import { ApiAccessTokensController } from './api-access-tokens.controller';
import { ApiAccessToken } from './entities/api-access-token.entity';  // Adjust the path if necessary

@Module({
  imports: [TypeOrmModule.forFeature([ApiAccessToken])],  // Import ApiAccessToken repository
  providers: [ApiAccessTokensService],
  controllers: [ApiAccessTokensController],
})
export class ApiAccessTokensModule {}
