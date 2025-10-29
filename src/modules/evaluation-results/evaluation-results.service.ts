import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationResult } from './evaluation-results.entity';
import { CreateEvaluationResultDto } from './dto/create-evaluation-result.dto';
import { UpdateEvaluationResultDto } from './dto/update-evaluation-result.dto';

@Injectable()
export class EvaluationResultsService {
  constructor(
    @InjectRepository(EvaluationResult)
    private readonly evaluationResultRepository: Repository<EvaluationResult>,
  ) {}

  async create(createEvaluationResultDto: CreateEvaluationResultDto): Promise<EvaluationResult> {
    const evaluationResult = this.evaluationResultRepository.create(createEvaluationResultDto);
    return await this.evaluationResultRepository.save(evaluationResult);
  }

  async findAll(): Promise<EvaluationResult[]> {
    return await this.evaluationResultRepository.find({
      relations: ['evaluation', 'student'],
    });
  }

  async findByEvaluationAndStudent(
    evaluationId: string,
    studentId: string,
  ): Promise<EvaluationResult> {
    const evaluationResult = await this.evaluationResultRepository.findOne({
      where: { evaluationId, studentId },
      relations: ['evaluation', 'student'],
    });

    if (!evaluationResult) {
      throw new NotFoundException(
        `EvaluationResult with evaluationId ${evaluationId} and studentId ${studentId} not found`,
      );
    }

    return evaluationResult;
  }

  async update(
    evaluationId: string,
    studentId: string,
    updateEvaluationResultDto: UpdateEvaluationResultDto,
  ): Promise<EvaluationResult> {
    const evaluationResult = await this.findByEvaluationAndStudent(evaluationId, studentId);
    Object.assign(evaluationResult, updateEvaluationResultDto);
    return await this.evaluationResultRepository.save(evaluationResult);
  }

  async remove(evaluationId: string, studentId: string): Promise<void> {
    const evaluationResult = await this.findByEvaluationAndStudent(evaluationId, studentId);
    await this.evaluationResultRepository.remove(evaluationResult);
  }
}
