import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationQuestionOption } from './evaluations_question_options.entity';
import { CreateQuestionOptionDto } from './dto/create-dto';

@Injectable()
export class EvaluationsQuestionOptionsService {
  constructor(
    @InjectRepository(EvaluationQuestionOption)
    private readonly evaluationQuestionOptionRepository: Repository<EvaluationQuestionOption>,
  ) {}

  async create(createQuestionOptionDto: CreateQuestionOptionDto[], questionId: string): Promise<EvaluationQuestionOption[]> {
    const createdOptions: EvaluationQuestionOption[] = [];
    for (let j = 0; j < createQuestionOptionDto.length; j++) {
      const optionData = createQuestionOptionDto[j];
      
      const option = this.evaluationQuestionOptionRepository.create({
        questionId: questionId,
        label: optionData.label,
        isCorrect: optionData.is_correct,
        orderIndex: j,
      });

      const savedOption = await this.evaluationQuestionOptionRepository.save(option);
      createdOptions.push(savedOption);
    }

    return createdOptions;
  }
}
