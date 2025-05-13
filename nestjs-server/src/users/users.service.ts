import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user with hashed password
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password_hash, ...rest } = createUserDto;

    if (!password_hash) {
      throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10); // changed Salt rounds = 10

    const user = this.userRepository.create({
      ...rest,
      password_hash: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Find a user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Update an existing user
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  // Remove a user
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
