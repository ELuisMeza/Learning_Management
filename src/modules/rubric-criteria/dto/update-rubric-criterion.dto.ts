import { PartialType } from '@nestjs/mapped-types';
import { CreateRubricCriterionDto } from './create-rubric-criterion.dto';

export class UpdateRubricCriterionDto extends PartialType(CreateRubricCriterionDto) {}
