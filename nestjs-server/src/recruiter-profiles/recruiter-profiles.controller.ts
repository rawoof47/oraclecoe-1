import { Controller, Get, Post, Body, Param, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { RecruiterProfilesService } from './recruiter-profiles.service';
import { CreateRecruiterProfileDto } from './dto/create-recruiter-profile.dto';
import { UpdateRecruiterProfileDto } from './dto/update-recruiter-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recruiter-profiles')
export class RecruiterProfilesController {
  constructor(private readonly recruiterProfilesService: RecruiterProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDto: CreateRecruiterProfileDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.recruiterProfilesService.create(createDto, userId);
  }

  @Get()
  findAll() {
    return this.recruiterProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recruiterProfilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateRecruiterProfileDto) {
    return this.recruiterProfilesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recruiterProfilesService.remove(id);
  }
}
