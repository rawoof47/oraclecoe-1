import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CandidateDegreesService } from './candidate_degrees.service';
import {
  CreateCandidateDegreeDto,
  UpdateCandidateDegreeDto,
} from './dto';

@Controller('candidate_degrees')
export class CandidateDegreesController {
  constructor(private readonly service: CandidateDegreesService) {}

  @Post()
  create(@Body() dto: CreateCandidateDegreeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCandidateDegreeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('bulk-replace')
  async bulkReplace(@Body() body: { user_id: string; degree_ids: string[] }) {
    return this.service.bulkReplace(body.user_id, body.degree_ids);
  }
  
}
