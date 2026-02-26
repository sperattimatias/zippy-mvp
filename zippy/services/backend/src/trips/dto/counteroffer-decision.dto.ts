import { IsIn, IsOptional, IsString } from 'class-validator';

export class CounterofferDecisionDto {
  @IsIn(['accept', 'reject'])
  decision!: 'accept' | 'reject';

  @IsOptional()
  @IsString()
  reason?: string;
}
