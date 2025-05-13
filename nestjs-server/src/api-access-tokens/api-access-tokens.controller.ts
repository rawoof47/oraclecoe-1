import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiAccessTokensService } from './api-access-tokens.service';
import { CreateApiAccessTokenDto } from './dto/create-api-access-token.dto';
import { UpdateApiAccessTokenDto } from './dto/update-api-access-token.dto';

@Controller('api-access-tokens')
export class ApiAccessTokensController {
  constructor(private readonly tokenService: ApiAccessTokensService) {}

  @Post()
  create(@Body() dto: CreateApiAccessTokenDto) {
    return this.tokenService.create(dto);
  }

  @Get()
  findAll() {
    return this.tokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tokenService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApiAccessTokenDto) {
    return this.tokenService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenService.remove(id);
  }
}
