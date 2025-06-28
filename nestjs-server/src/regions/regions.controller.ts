import { Controller, Get } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { Region } from './region.entity';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  async getAllRegions(): Promise<Region[]> {
    return this.regionsService.findAll();
  }
}
