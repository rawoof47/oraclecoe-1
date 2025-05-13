import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiAccessToken } from './entities/api-access-token.entity';
import { CreateApiAccessTokenDto } from './dto/create-api-access-token.dto';
import { UpdateApiAccessTokenDto } from './dto/update-api-access-token.dto';

@Injectable()
export class ApiAccessTokensService {
  constructor(
    @InjectRepository(ApiAccessToken)
    private readonly tokenRepository: Repository<ApiAccessToken>,
  ) {}

  async create(dto: CreateApiAccessTokenDto): Promise<ApiAccessToken> {
    const token = this.tokenRepository.create(dto);
    return await this.tokenRepository.save(token);
  }

  async findAll(): Promise<ApiAccessToken[]> {
    return this.tokenRepository.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string): Promise<ApiAccessToken | null> {
    return this.tokenRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateApiAccessTokenDto): Promise<ApiAccessToken> {
    const token = await this.tokenRepository.findOne({ where: { id } });
    if (!token) throw new Error('Token not found');

    Object.assign(token, dto);
    return await this.tokenRepository.save(token);
  }

  async remove(id: string): Promise<void> {
    await this.tokenRepository.delete(id);
  }
}
