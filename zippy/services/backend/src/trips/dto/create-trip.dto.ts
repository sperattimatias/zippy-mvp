import { IsNumber, IsObject } from 'class-validator';

export class CreateTripDto {
  @IsObject()
  origin!: { lat: number; lng: number };

  @IsObject()
  destination!: { lat: number; lng: number };

  @IsNumber()
  proposed_price!: number;
}
