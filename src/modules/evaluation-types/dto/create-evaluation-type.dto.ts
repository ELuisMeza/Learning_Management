import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateEvaluationTypeDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
