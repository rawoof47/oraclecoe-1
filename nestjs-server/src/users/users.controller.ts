import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // ✅ Get a user by ID
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ✅ Update user email
  @Patch(':id/email')
  async updateEmail(
    @Param('id') id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.userService.updateEmail(id, updateEmailDto.email);
  }

  // ✅ Update user password
  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, updatePasswordDto.password);
  }
}
