import { PartialType } from '@nestjs/mapped-types';
import { CreateRubricLevelDto } from './create-rubric-level.dto';

export class UpdateRubricLevelDto extends PartialType(CreateRubricLevelDto) {}
