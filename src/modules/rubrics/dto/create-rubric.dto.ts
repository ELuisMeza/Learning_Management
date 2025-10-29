import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateRubricDto {
  @IsUUID()
  teacherId: string;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  userCreatorId: string;
}
