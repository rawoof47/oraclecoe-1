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
  @UseGuards(JwtAuthGuard) // ✅ protects the route
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const url = await this.awsService.uploadProfilePic(file);
    const userId = req.user?.id;

    if (userId) {
      await this.candidateProfilesService.updateProfilePic(userId, url);
    }

    return { url };
  }
}
