import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RubricLevel } from './rubric-levels.entity';
import { CreateRubricLevelDto } from './dto/create-rubric-level.dto';
import { UpdateRubricLevelDto } from './dto/update-rubric-level.dto';

@Injectable()
export class RubricLevelsService {
  constructor(
    @InjectRepository(RubricLevel)
    private readonly rubricLevelRepository: Repository<RubricLevel>,
  ) {}

  async create(createRubricLevelDto: CreateRubricLevelDto): Promise<RubricLevel> {
    const rubricLevel = this.rubricLevelRepository.create(createRubricLevelDto);
    return await this.rubricLevelRepository.save(rubricLevel);
  }

  async findAll(): Promise<RubricLevel[]> {
    return await this.rubricLevelRepository.find({
      relations: ['criterion'],
    });
  }

  async findOne(id: string): Promise<RubricLevel> {
    const rubricLevel = await this.rubricLevelRepository.findOne({
      where: { id },
      relations: ['criterion'],
    });

    if (!rubricLevel) {
      throw new NotFoundException(`RubricLevel with ID ${id} not found`);
    }

    return rubricLevel;
  }

  async update(
    id: string,
    updateRubricLevelDto: UpdateRubricLevelDto,
  ): Promise<RubricLevel> {
    const rubricLevel = await this.findOne(id);
    Object.assign(rubricLevel, updateRubricLevelDto);
    return await this.rubricLevelRepository.save(rubricLevel);
  }

  async remove(id: string): Promise<void> {
    const rubricLevel = await this.findOne(id);
    await this.rubricLevelRepository.remove(rubricLevel);
  }
}
