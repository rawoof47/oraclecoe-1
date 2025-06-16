import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  // ✅ Create a new user with hashed password and check for existing email
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password_hash, email, ...rest } = createUserDto;

    if (!password_hash) {
      throw new BadRequestException('Password is required');
    }

    // ✅ Check for duplicate email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password_hash, 10); // Salt rounds = 10
      const user = this.userRepository.create({
        ...rest,
        email,
        password_hash: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Find a user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

// Update an existing user
async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  const result = await this.userRepository.update(id, updateUserDto);
  if (result.affected === 0) {
    throw new NotFoundException('User not found');
  }

  const updatedUser = await this.userRepository.findOne({ where: { id } });

  if (!updatedUser) {
    throw new NotFoundException('User not found after update');
  }

  return updatedUser;
}


  // Remove a user
  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
