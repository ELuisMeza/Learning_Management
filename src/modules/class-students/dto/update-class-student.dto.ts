import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateClassStudentDto } from './create-class-student.dto';

export class UpdateClassStudentDto extends OmitType(
  PartialType(CreateClassStudentDto),
  ['classId', 'studentId'] as const,
) {}
