import { IsString, IsOptional, IsDecimal, IsUUID, MaxLength } from 'class-validator';

export class CreateRubricLevelDto {
  @IsUUID()
  criterionId: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDecimal()
  score: number;
}
