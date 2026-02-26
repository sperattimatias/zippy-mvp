import { Body, Controller, Post } from '@nestjs/common';
import { SosDto } from './dto/sos.dto';

@Controller('safety')
export class SafetyController {
  @Post('sos')
  sos(@Body() dto: SosDto) {
    return { status: 'received', caseId: `sos_${Date.now()}`, tripId: dto.tripId };
  }
}
