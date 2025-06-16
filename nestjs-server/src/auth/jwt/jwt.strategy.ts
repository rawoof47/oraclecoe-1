import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') ?? '';
    console.log('🔐 [JwtStrategy] Loaded JWT_SECRET:', secret); // ✅ Debug log

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('✅ [JwtStrategy] Decoded JWT Payload:', payload); // ✅ Debug log
    return payload; // You can enhance this with user validation if needed
  }
}
