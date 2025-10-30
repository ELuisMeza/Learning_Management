import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationType } from './evaluation-types.entity';

@Injectable()
export class EvaluationTypesService {
  constructor(
    @InjectRepository(EvaluationType)
    private readonly evaluationTypeRepository: Repository<EvaluationType>,
  ) {}

}
