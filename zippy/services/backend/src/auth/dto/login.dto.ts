import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  phone!: string;

  @IsString()
  @Length(4, 8)
  otp!: string;
}
