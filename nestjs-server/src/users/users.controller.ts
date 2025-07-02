import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

  @Put('update-name/:id')
  async updateName(
    @Param('id') id: string,
    @Body() updateNameDto: {
      first_name: string;
      last_name: string;
      middle_name?: string;
    },
  ): Promise<User> {
    const { first_name, last_name, middle_name } = updateNameDto;
    return this.userService.updateName(id, first_name, last_name, middle_name);
  }

  // Add this endpoint to UserController
@Post('change-password')
async changePassword(
  @Body() body: {
    user_id: string;
    current_password: string;
    new_password: string;
  },
): Promise<void> {
  return this.userService.changePassword(
    body.user_id,
    body.current_password,
    body.new_password,
  );
}

// Add this endpoint to UserController
@Get('check-email/:email')
async checkEmailRegistered(
  @Param('email') email: string
): Promise<{ registered: boolean }> {
  const exists = await this.userService.isEmailRegistered(email);
  return { registered: exists };
}
}