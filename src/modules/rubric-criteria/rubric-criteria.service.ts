import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RubricCriterion } from './rubric-criteria.entity';
import { CreateRubricCriterionDto } from './dto/create-rubric-criterion.dto';
import { UpdateRubricCriterionDto } from './dto/update-rubric-criterion.dto';

@Injectable()
export class RubricCriteriaService {
  constructor(
    @InjectRepository(RubricCriterion)
    private readonly rubricCriterionRepository: Repository<RubricCriterion>,
  ) {}

  async create(createRubricCriterionDto: CreateRubricCriterionDto): Promise<RubricCriterion> {
    const rubricCriterion = this.rubricCriterionRepository.create(createRubricCriterionDto);
    return await this.rubricCriterionRepository.save(rubricCriterion);
  }

  async findAll(): Promise<RubricCriterion[]> {
    return await this.rubricCriterionRepository.find({
      relations: ['rubric'],
    });
  }

  async findOne(id: string): Promise<RubricCriterion> {
    const rubricCriterion = await this.rubricCriterionRepository.findOne({
      where: { id },
      relations: ['rubric'],
    });

    if (!rubricCriterion) {
      throw new NotFoundException(`RubricCriterion with ID ${id} not found`);
    }

    return rubricCriterion;
  }

  async update(
    id: string,
    updateRubricCriterionDto: UpdateRubricCriterionDto,
  ): Promise<RubricCriterion> {
    const rubricCriterion = await this.findOne(id);
    Object.assign(rubricCriterion, updateRubricCriterionDto);
    return await this.rubricCriterionRepository.save(rubricCriterion);
  }

  async remove(id: string): Promise<void> {
    const rubricCriterion = await this.findOne(id);
    await this.rubricCriterionRepository.remove(rubricCriterion);
  }
}
