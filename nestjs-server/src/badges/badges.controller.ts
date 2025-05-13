import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  create(@Body() dto: CreateBadgeDto) {
    return this.badgesService.create(dto);
  }

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badgesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBadgeDto) {
    return this.badgesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.badgesService.remove(id);
  }
}
