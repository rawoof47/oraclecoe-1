import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config'; // ✅ Import ConfigService
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    console.log('📥 Incoming login:', email);

    const user = await this.usersRepository.findOne({
      where: { email },
      relations: [],
    });

    console.log('🔍 Found user:', user);

    if (!user) {
      console.warn('❌ No user found with email:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password match:', isPasswordValid);

    if (!isPasswordValid) {
      console.warn('❌ Incorrect password for user:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = await this.rolesRepository.findOne({
      where: { id: user.role_id },
    });

    if (!role) {
      console.warn('❌ Role not found for user:', user.id);
      throw new UnauthorizedException('User role not found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: role.role_name,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'), // ✅ Consistent usage
      expiresIn: '7d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'), // ✅ Consistent usage
      expiresIn: '7d',
    });

    return {
      token: accessToken,
      refreshToken,
      uuid: user.id,
      role: role.role_name,
    };
  }

  async refreshAccessToken(user: any) {
    const payload = {
      sub: user.sub,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'), // ✅ Consistent usage
      expiresIn: '7d',
    });

    return { token: accessToken };
  }

  async handleForgotPassword(email: string): Promise<void> {
  try {
    console.log('📥 Forgot password requested for:', email);

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      console.warn('❌ Email not found in DB:', email);
      throw new NotFoundException('Email not found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      purpose: 'password-reset',
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    const resetLink = `https://oraxinno.com/reset-password/${token}`;

    console.log('📨 Sending reset link:', resetLink);

    await this.mailService.sendResetPasswordEmail(email, resetLink);

    console.log('✅ Email sent successfully.');
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    throw err; // Don't swallow it — let NestJS return the right error code
  }
}


}
