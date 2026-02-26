import { IsNumber } from 'class-validator';

export class CounterofferDto {
  @IsNumber()
  counteroffer_price!: number;
}
