import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SosDto {
  @IsString()
  tripId!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsOptional()
  @IsString()
  message?: string;
}
