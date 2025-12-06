import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RubricLevel } from './rubric-levels.entity';
import { CreateRubricLevelDto } from './dto/create.dto';

@Injectable()
export class RubricLevelsService {
  constructor(
    @InjectRepository(RubricLevel)
    private readonly rubricLevelRepository: Repository<RubricLevel>,
  ) {}

  async create(createRubricLevelDto: CreateRubricLevelDto, criterionId: string): Promise<RubricLevel> {
    try {
      const payload: Partial<RubricLevel> = {
        name: createRubricLevelDto.name,
        description: createRubricLevelDto.description || undefined,
        score: createRubricLevelDto.score,
        criterionId: criterionId,
      };
      
      const rubricLevel = this.rubricLevelRepository.create(payload);
      return await this.rubricLevelRepository.save(rubricLevel);
    } catch (error) {
      console.error('=== ERROR AL CREAR NIVEL ===');
      console.error('Error:', error);
      console.error('DTO:', JSON.stringify(createRubricLevelDto, null, 2));
      console.error('CriterionId:', criterionId);
      console.error('============================');
      throw error;
    }
  }

}
