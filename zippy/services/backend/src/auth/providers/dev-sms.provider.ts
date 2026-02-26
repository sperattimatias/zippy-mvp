import { Injectable, Logger } from '@nestjs/common';
import { SmsProvider } from './sms-provider.interface';

@Injectable()
export class DevSmsProvider implements SmsProvider {
  private readonly logger = new Logger(DevSmsProvider.name);

  async sendOtp(phone: string, code: string): Promise<void> {
    this.logger.log(JSON.stringify({ provider: 'dev', phone, code, sent: false }));
  }
}
