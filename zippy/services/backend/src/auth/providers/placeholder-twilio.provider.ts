import { Injectable, Logger } from '@nestjs/common';
import { SmsProvider } from './sms-provider.interface';

@Injectable()
export class PlaceholderTwilioProvider implements SmsProvider {
  private readonly logger = new Logger(PlaceholderTwilioProvider.name);

  async sendOtp(phone: string, code: string): Promise<void> {
    this.logger.log(JSON.stringify({ provider: 'twilio-placeholder', phone, codeLength: code.length }));
  }
}
