import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepo: Repository<AdminUser>,
  ) {}

  async create(dto: CreateAdminUserDto): Promise<AdminUser> {
    const newAdmin = this.adminUserRepo.create(dto);
    return await this.adminUserRepo.save(newAdmin);
  }

  async findAll(): Promise<AdminUser[]> {
    return await this.adminUserRepo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string): Promise<AdminUser> {
    const admin = await this.adminUserRepo.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin user with ID ${id} not found`);
    }
    return admin;
  }

  async update(id: string, dto: UpdateAdminUserDto): Promise<AdminUser> {
    const result = await this.adminUserRepo.update(id, dto);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin user with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.adminUserRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin user with ID ${id} not found`);
    }
    return { message: `Admin user with ID ${id} deleted successfully.` };
  }
}
