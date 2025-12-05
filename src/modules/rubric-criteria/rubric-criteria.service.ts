import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RubricCriterion } from './rubric-criteria.entity';
import { CreateRubricCriterionDto } from './dto/create.dto';

@Injectable()
export class RubricCriteriaService {
  constructor(
    @InjectRepository(RubricCriterion)
    private readonly rubricCriterionRepository: Repository<RubricCriterion>,
  ) {}

  async create(createRubricCriterionDto: CreateRubricCriterionDto, rubricId: string): Promise<RubricCriterion> {
    const payload: Partial<RubricCriterion> = {
      ...createRubricCriterionDto,
      rubricId: rubricId,
    };
    const rubricCriterion = this.rubricCriterionRepository.create(payload);
    return await this.rubricCriterionRepository.save(rubricCriterion);
  }

}
