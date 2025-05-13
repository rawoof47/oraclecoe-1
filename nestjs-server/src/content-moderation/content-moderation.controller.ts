import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContentModerationService } from './content-moderation.service';
import { CreateContentModerationDto } from './dto/create-content-moderation.dto';
import { UpdateContentModerationDto } from './dto/update-content-moderation.dto';

@Controller('content-moderation')
export class ContentModerationController {
  constructor(private readonly service: ContentModerationService) {}

  @Post()
  create(@Body() dto: CreateContentModerationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContentModerationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
