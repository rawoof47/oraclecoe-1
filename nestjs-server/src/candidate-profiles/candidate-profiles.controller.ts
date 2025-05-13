import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';

@Controller('candidate-profiles')
export class CandidateProfilesController {
  constructor(
    private readonly candidateProfilesService: CandidateProfilesService,
  ) {}

  // Get a candidate profile by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.candidateProfilesService.findOne(id);
  }

  // Create a new candidate profile
  @Post()
  async create(@Body() createCandidateProfileDto: CreateCandidateProfileDto) {
    return this.candidateProfilesService.create(createCandidateProfileDto);
  }

  // Update an existing candidate profile
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCandidateProfileDto: UpdateCandidateProfileDto,
  ) {
    return this.candidateProfilesService.update(id, updateCandidateProfileDto);
  }

  // Delete a candidate profile by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.candidateProfilesService.remove(id);
  }
}
