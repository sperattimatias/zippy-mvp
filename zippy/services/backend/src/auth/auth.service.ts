import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SmsProvider } from './providers/sms-provider.interface';

@Injectable()
export class AuthService {
  constructor(private readonly smsProvider: SmsProvider) {}

  async login(dto: LoginDto) {
    await this.smsProvider.sendOtp(dto.phone, dto.otp);
    return { accessToken: 'dev-jwt-token', user: { id: 'u1', role: 'passenger' } };
  }
}
