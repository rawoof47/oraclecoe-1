import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  async create(@Body() createActivityLogDto: CreateActivityLogDto) {
    return await this.activityLogsService.create(createActivityLogDto);
  }

  @Get()
  async findAll() {
    return await this.activityLogsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.activityLogsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityLogDto: UpdateActivityLogDto,
  ) {
    return await this.activityLogsService.update(id, updateActivityLogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.activityLogsService.remove(id);
  }
}
