import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubric } from './rubrics.entity';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { UpdateRubricDto } from './dto/update-rubric.dto';

@Injectable()
export class RubricsService {
  constructor(
    @InjectRepository(Rubric)
    private readonly rubricRepository: Repository<Rubric>,
  ) {}

  async create(createRubricDto: CreateRubricDto): Promise<Rubric> {
    const rubric = this.rubricRepository.create(createRubricDto);
    return await this.rubricRepository.save(rubric);
  }

  async findAll(): Promise<Rubric[]> {
    return await this.rubricRepository.find({
      relations: ['teacher', 'userCreator'],
    });
  }

  async findOne(id: string): Promise<Rubric> {
    const rubric = await this.rubricRepository.findOne({
      where: { id },
      relations: ['teacher', 'userCreator'],
    });

    if (!rubric) {
      throw new NotFoundException(`Rubric with ID ${id} not found`);
    }

    return rubric;
  }

  async update(id: string, updateRubricDto: UpdateRubricDto): Promise<Rubric> {
    const rubric = await this.findOne(id);
    Object.assign(rubric, updateRubricDto);
    return await this.rubricRepository.save(rubric);
  }

  async remove(id: string): Promise<void> {
    const rubric = await this.findOne(id);
    await this.rubricRepository.remove(rubric);
  }
}
