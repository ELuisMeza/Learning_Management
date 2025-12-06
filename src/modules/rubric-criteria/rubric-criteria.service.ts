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
    try {
      const payload: Partial<RubricCriterion> = {
        name: createRubricCriterionDto.name,
        description: createRubricCriterionDto.description || undefined,
        weight: createRubricCriterionDto.weight ?? 1.0,
        rubricId: rubricId,
      };
      const rubricCriterion = this.rubricCriterionRepository.create(payload);
      return await this.rubricCriterionRepository.save(rubricCriterion);
    } catch (error) {
      console.error('=== ERROR AL CREAR CRITERIO ===');
      console.error('Error:', error);
      console.error('DTO:', JSON.stringify(createRubricCriterionDto, null, 2));
      console.error('RubricId:', rubricId);
      console.error('================================');
      throw error;
    }
  }

}
