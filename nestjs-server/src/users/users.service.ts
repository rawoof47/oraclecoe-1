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
import { MailService } from '../mail/mail.service'; // ✅ Import MailService
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService, // ✅ Inject MailService
  ) {}
  
  // ✅ Create a new user with hashed password and check for existing email
  async create(createUserDto: CreateUserDto): Promise<User> {
  const {
    password_hash,
    email,
    first_name,
    middle_name,
    last_name,
    role_id,
    ...rest
  } = createUserDto;

  if (!password_hash) {
    throw new BadRequestException('Password is required');
  }

  // Check for duplicate email
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
      first_name,
      middle_name,
      last_name,
      role_id,
    });

    const savedUser = await this.userRepository.save(user);

    // ✅ Role-based welcome emails
    const CANDIDATE_ROLE_ID = 'c1bb8df5-2c01-11f0-b60f-80ce6232908a';
    const RECRUITER_ROLE_ID = 'c1bb84ef-2c01-11f0-b60f-80ce6232908a';

    if (savedUser.role_id === CANDIDATE_ROLE_ID) {
      await this.mailService.sendCandidateWelcomeEmail(email);
    } else if (savedUser.role_id === RECRUITER_ROLE_ID) {
      await this.mailService.sendRecruiterWelcomeEmail(email);
    }

    return savedUser;
  } catch (error) {
    console.error('❌ Error creating user:', error);
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

  // ✅ Update only the name fields
  async updateName(
    id: string,
    first_name: string,
    last_name: string,
    middle_name?: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.first_name = first_name;
    user.last_name = last_name;

    // Explicitly update middle name only if it's provided
    user.middle_name = (middle_name === undefined) ? user.middle_name : middle_name;

    return await this.userRepository.save(user);
  }

  async changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password_hash,
  );
  if (!isPasswordValid) {
    throw new BadRequestException('Current password is incorrect');
  }

  // Hash and save new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password_hash = hashedPassword;
  
  await this.userRepository.save(user);
}

// Add this method to UserService
async isEmailRegistered(email: string): Promise<boolean> {
  const user = await this.userRepository.findOne({ where: { email } });
  return !!user;
}
}