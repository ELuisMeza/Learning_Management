import { IsString, IsOptional, IsInt, IsDecimal, IsUUID, MaxLength } from 'class-validator';

export class CreateRubricCriterionDto {
  @IsUUID()
  rubricId: string;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDecimal()
  weight?: number;

  @IsOptional()
  @IsInt()
  orderNumber?: number;
}
