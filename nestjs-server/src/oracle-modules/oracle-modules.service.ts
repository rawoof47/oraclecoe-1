import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OracleModule } from './entities/oracle-module.entity';
import { CreateOracleModuleDto } from './dto/create-oracle-module.dto';
import { UpdateOracleModuleDto } from './dto/update-oracle-module.dto';

@Injectable()
export class OracleModulesService {
  constructor(
    @InjectRepository(OracleModule)
    private readonly repo: Repository<OracleModule>,
  ) {}

  async create(dto: CreateOracleModuleDto): Promise<OracleModule> {
    const record = this.repo.create(dto);
    return await this.repo.save(record);
  }

  async findAll(): Promise<OracleModule[]> {
    return await this.repo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string): Promise<OracleModule> {
    return await this.repo.findOneOrFail({ where: { id } });
  }

  async update(id: string, dto: UpdateOracleModuleDto): Promise<OracleModule> {
    const record = await this.repo.findOneOrFail({ where: { id } });
    Object.assign(record, dto);
    return await this.repo.save(record);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
