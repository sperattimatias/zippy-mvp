import { IsDateString, IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber()
  lat!: number;
  @IsNumber()
  lng!: number;
  @IsNumber()
  heading!: number;
  @IsNumber()
  speed!: number;
  @IsDateString()
  timestamp!: string;
}
