import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OracleModulesService } from './oracle-modules.service';
import { CreateOracleModuleDto } from './dto/create-oracle-module.dto';
import { UpdateOracleModuleDto } from './dto/update-oracle-module.dto';

@Controller('oracle-modules')
export class OracleModulesController {
  constructor(private readonly service: OracleModulesService) {}

  @Post()
  create(@Body() dto: CreateOracleModuleDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateOracleModuleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
