import { IsUUID, IsOptional, IsEnum, IsDateString, IsDecimal } from 'class-validator';

export class CreateClassStudentDto {
  @IsUUID()
  classId: string;

  @IsUUID()
  studentId: string;

  @IsOptional()
  @IsDateString()
  enrollmentDate?: string;

  @IsOptional()
  @IsDecimal()
  finalNote?: number;

  @IsOptional()
  @IsEnum(['in_course', 'completed', 'withdrawn'])
  status?: string;
}
