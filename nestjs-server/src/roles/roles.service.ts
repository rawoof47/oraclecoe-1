import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';  // Correct import path
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Create a new role
  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  // Get all roles
  findAll() {
    return this.roleRepository.find();
  }

  // Get role by ID
  findOne(id: string) {
    return this.roleRepository.findOne({ where: { id } });
  }

  // Update role by ID
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error('Role not found');
    }

    return this.roleRepository.save({ ...role, ...updateRoleDto });
  }

  // Delete role by ID
  async remove(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error('Role not found');
    }

    return this.roleRepository.remove(role);
  }
}
