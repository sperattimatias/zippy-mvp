import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DevSmsProvider } from './providers/dev-sms.provider';
import { PlaceholderTwilioProvider } from './providers/placeholder-twilio.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    DevSmsProvider,
    PlaceholderTwilioProvider,
    {
      provide: 'SmsProvider',
      useExisting: DevSmsProvider,
    },
  ],
})
export class AuthModule {}
