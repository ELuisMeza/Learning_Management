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

    const payload: Partial<RubricLevel> = {
      ...createRubricLevelDto,
      criterionId: criterionId,
    };
    
    const rubricLevel = this.rubricLevelRepository.create(payload);
    return await this.rubricLevelRepository.save(rubricLevel);
  }

}
