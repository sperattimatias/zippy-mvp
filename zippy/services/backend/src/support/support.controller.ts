import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('support')
export class SupportController {
  @Post('tickets')
  createTicket(@Body() dto: CreateTicketDto) {
    return { ticketId: `tk_${Date.now()}`, status: 'open', category: dto.category };
  }
}
