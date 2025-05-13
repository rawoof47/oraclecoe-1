// src/admin-users/admin-users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUser } from './entities/admin-user.entity';  // Assuming this is your entity

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],  // Add this to make the AdminUser repository available
  providers: [AdminUsersService],
  controllers: [AdminUsersController],
})
export class AdminUsersModule {}
