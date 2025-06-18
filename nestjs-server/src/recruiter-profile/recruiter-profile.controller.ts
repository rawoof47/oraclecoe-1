import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { RecruiterProfileService } from './recruiter-profile.service';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    sub: string;
  };
}

@Controller('recruiter-profiles')
export class RecruiterProfileController {
  constructor(
    private readonly recruiterProfileService: RecruiterProfileService,
  ) {}

  // ✅ Upsert endpoint
  @UseGuards(JwtAuthGuard)
  @Post('upsert')
  async upsert(
    @Body() data: UpdateRecruiterProfileDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.recruiterProfileService.upsert(data, userId);
  }

  // 🔍 Get profile for current user
  @UseGuards(JwtAuthGuard)
  @Get('by-user/me')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.recruiterProfileService.findByUserId(userId);
  }
}