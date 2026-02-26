import { ArrayNotEmpty, IsArray, IsIn, IsInt, Max, Min } from 'class-validator';

export class RateTripDto {
  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(['safe_driving', 'on_time', 'clean_vehicle', 'friendly', 'route_issue'], { each: true })
  tags!: string[];
}
