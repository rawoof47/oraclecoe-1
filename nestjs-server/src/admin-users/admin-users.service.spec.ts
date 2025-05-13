import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { CreateAdminUserDto } from './dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
  ) {}

  create(createDto: CreateAdminUserDto) {
    const entity = this.adminUserRepository.create(createDto);
    return this.adminUserRepository.save(entity);
  }

  findAll() {
    return this.adminUserRepository.find();
  }

  findOne(id: string) {
    return this.adminUserRepository.findOne({ where: { id } });
  }
}
