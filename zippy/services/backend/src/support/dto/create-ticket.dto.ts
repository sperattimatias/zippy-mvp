import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsIn(['payment', 'app_issue', 'safety', 'other'])
  category!: 'payment' | 'app_issue' | 'safety' | 'other';

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  tripId?: string;
}
