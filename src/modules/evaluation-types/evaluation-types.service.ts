import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationType } from './evaluation-types.entity';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';

@Injectable()
export class EvaluationTypesService {
  constructor(
    @InjectRepository(EvaluationType)
    private readonly evaluationTypeRepository: Repository<EvaluationType>,
  ) {}

  async getAll(): Promise<EvaluationType[]> {
    return await this.evaluationTypeRepository.find();
  }   

}
