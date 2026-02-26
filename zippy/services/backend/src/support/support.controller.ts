import { Body, Controller, Headers, Post } from '@nestjs/common';
import { requireRole } from '../common/auth-context';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('support')
export class SupportController {
  @Post('tickets')
  createTicket(@Headers('x-role') role: string, @Body() dto: CreateTicketDto) {
    requireRole(role, ['passenger', 'driver', 'admin']);
    return { ticketId: `tk_${Date.now()}`, status: 'open', category: dto.category };
  }
}
