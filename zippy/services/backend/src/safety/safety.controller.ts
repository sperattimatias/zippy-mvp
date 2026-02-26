import { Body, Controller, Headers, Post } from '@nestjs/common';
import { requireRole } from '../common/auth-context';
import { SosDto } from './dto/sos.dto';

@Controller('safety')
export class SafetyController {
  @Post('sos')
  sos(@Headers('x-role') role: string, @Body() dto: SosDto) {
    requireRole(role, ['passenger', 'driver']);
    return { status: 'received', caseId: `sos_${Date.now()}`, tripId: dto.tripId };
  }
}
