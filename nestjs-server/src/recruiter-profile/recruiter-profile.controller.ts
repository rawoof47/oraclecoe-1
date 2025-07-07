import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecruiterProfileService } from './recruiter-profile.service';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AwsService } from '../aws/aws.service';

interface AuthenticatedRequest {
  user: {
    sub: string;
  };
}

@Controller('recruiter-profiles')
export class RecruiterProfileController {
  constructor(
    private readonly recruiterProfileService: RecruiterProfileService,
    private readonly awsService: AwsService,
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

  @UseGuards(JwtAuthGuard)
@Post('upload-logo')
@UseInterceptors(FileInterceptor('file'))
async uploadLogo(
  @UploadedFile() file: Express.Multer.File,
  @Req() req: AuthenticatedRequest,
) {
  const userId = req.user.sub;

  // Upload to AWS and get public URL
  const logoUrl = await this.awsService.uploadCompanyLogo(file);


  // Save URL to DB
  return this.recruiterProfileService.updateLogo(userId, logoUrl);
}

}