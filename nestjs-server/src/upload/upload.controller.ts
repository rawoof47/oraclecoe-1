import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../aws/aws.service';
import { CandidateProfilesService } from '../candidate-profiles/candidate-profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly awsService: AwsService,
    private readonly candidateProfilesService: CandidateProfilesService,
  ) {}

 @Post('profile-pic')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file'))
async uploadProfilePic(
  @UploadedFile() file: Express.Multer.File,
  @Req() req: any
) {
  const url = await this.awsService.uploadProfilePic(file);
  const userId = req.user?.sub; // ✅ FIXED: use sub

  if (userId) {
    await this.candidateProfilesService.updateProfilePic(userId, url);
  }

  return { url };
}

// upload.controller.ts

@Post('resume')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file'))
async uploadResume(
  @UploadedFile() file: Express.Multer.File,
  @Req() req: any
) {
  const userId = req.user?.sub;
  const resumeUrl = await this.awsService.uploadResume(file);

  if (userId) {
    await this.candidateProfilesService.updateResumeLink(userId, resumeUrl);
  }

  return { url: resumeUrl };
}

}
