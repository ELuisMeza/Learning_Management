import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationType } from './evaluation-types.entity';
import { CreateEvaluationTypeDto } from './dto/create-evaluation-type.dto';
import { UpdateEvaluationTypeDto } from './dto/update-evaluation-type.dto';

@Injectable()
export class EvaluationTypesService {
  constructor(
    @InjectRepository(EvaluationType)
    private readonly evaluationTypeRepository: Repository<EvaluationType>,
  ) {}

  async create(createEvaluationTypeDto: CreateEvaluationTypeDto): Promise<EvaluationType> {
    const evaluationType = this.evaluationTypeRepository.create(createEvaluationTypeDto);
    return await this.evaluationTypeRepository.save(evaluationType);
  }

  async findAll(): Promise<EvaluationType[]> {
    return await this.evaluationTypeRepository.find();
  }

  async findOne(id: string): Promise<EvaluationType> {
    const evaluationType = await this.evaluationTypeRepository.findOne({ where: { id } });

    if (!evaluationType) {
      throw new NotFoundException(`EvaluationType with ID ${id} not found`);
    }

    return evaluationType;
  }

  async update(
    id: string,
    updateEvaluationTypeDto: UpdateEvaluationTypeDto,
  ): Promise<EvaluationType> {
    const evaluationType = await this.findOne(id);
    Object.assign(evaluationType, updateEvaluationTypeDto);
    return await this.evaluationTypeRepository.save(evaluationType);
  }

  async remove(id: string): Promise<void> {
    const evaluationType = await this.findOne(id);
    await this.evaluationTypeRepository.remove(evaluationType);
  }
}
