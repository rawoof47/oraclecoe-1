import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email?: string;
    role?: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('candidate-profiles')
export class CandidateProfilesController {
  constructor(
    private readonly candidateProfilesService: CandidateProfilesService,
  ) {
    console.log('[CandidateProfilesController] Initialized');
  }

  // 🎯 Create a new candidate profile
  @Post()
  async create(
    @Body() payload: CreateCandidateProfileDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user.sub;
    console.log('[POST] /candidate-profiles');
    console.log('Payload:', payload);
    console.log('User ID:', userId);

    const result = await this.candidateProfilesService.create(payload, userId);
    console.log('Profile Created:', result);
    return result;
  }

  // ✅ NEW: Simple upsert using updated_by
  @Post('upsert')
  async saveProfile(
    @Body() profileData: UpdateCandidateProfileDto,
    @Req() req: AuthenticatedRequest,
  ) {
    console.log('[POST] /candidate-profiles/upsert');
    const userId = req.user.sub;
    profileData.updated_by = userId;
    const result = await this.candidateProfilesService.updateProfile(profileData);
    console.log('Upsert Result:', result);
    return result;
  }

  // 🔍 Get all candidate profiles
  @Get()
  async findAll(): Promise<any> {
    console.log('[GET] /candidate-profiles');
    const result = await this.candidateProfilesService.findAll();
    console.log('All Profiles:', result);
    return result;
  }

  // 🔍 Get a specific candidate profile by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    console.log(`[GET] /candidate-profiles/${id}`);
    const result = await this.candidateProfilesService.findOne(id);
    console.log('Profile Found:', result);
    return result;
  }

  // ✏️ Update a candidate profile
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCandidateProfileDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user.sub;
    console.log(`[PUT] /candidate-profiles/${id}`);
    console.log('Payload:', payload);
    console.log('User ID:', userId);

    const result = await this.candidateProfilesService.update(
      id,
      payload,
      userId,
    );
    console.log('Profile Updated:', result);
    return result;
  }

  // ❌ Delete a candidate profile
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    console.log(`[DELETE] /candidate-profiles/${id}`);
    const result = await this.candidateProfilesService.remove(id);
    console.log('Profile Deleted:', result);
    return result;
  }
  // Add this new endpoint to the controller
@Get('by-user/me')
async getMyProfile(@Req() req: AuthenticatedRequest) {
  const userId = req.user.sub;
  console.log(`[GET] /candidate-profiles/by-user/me for user ${userId}`);
  const result = await this.candidateProfilesService.findByUserId(userId);
  console.log('Profile Found:', result);
  return result;
}
}