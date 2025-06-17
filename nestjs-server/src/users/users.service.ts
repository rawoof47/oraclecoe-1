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

  //  Create a new user with hashed password
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password_hash, email, ...rest } = createUserDto;

    if (!password_hash) {
      throw new BadRequestException('Password is required');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password_hash, 10);
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

  //  Get all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  //  Get one user
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //  Update user data
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

  //  Delete user
  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  //  Update only name fields
  async updateName(
    id: string,
    first_name: string,
    last_name: string,
    middle_name?: string,
  ): Promise<User> {
    const user = await this.findOne(id);
    user.first_name = first_name;
    user.last_name = last_name;
    user.middle_name = middle_name !== undefined ? middle_name : user.middle_name;
    return await this.userRepository.save(user);
  }

  //  Update email (with conflict check)
  async updateEmail(id: string, email: string): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing && existing.id !== id) {
      throw new ConflictException('Email is already in use');
    }

    const user = await this.findOne(id);
    user.email = email;
    return await this.userRepository.save(user);
  }

  //  Update password (hashed)
  async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.findOne(id);
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password_hash = hashedPassword;
    return await this.userRepository.save(user);
  }

  //  Get a user by ID (alias to findOne, for controller usage)
  async getUserById(id: string): Promise<User> {
    return this.findOne(id);
  }
}
