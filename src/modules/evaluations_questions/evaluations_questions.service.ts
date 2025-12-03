import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationQuestion } from './evaluations_questions.entity';
import { EvaluationQuestionOption } from '../evaluations_question_options/evaluations_question_options.entity';
import { Evaluation } from '../evaluations/evaluations.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { EvaluationsQuestionOptionsService } from '../evaluations_question_options/evaluations_question_options.service';

@Injectable()
export class EvaluationsQuestionsService {
  constructor(
    @InjectRepository(EvaluationQuestion)
    private readonly questionRepository: Repository<EvaluationQuestion>,
    @InjectRepository(EvaluationQuestionOption)
    private readonly optionRepository: Repository<EvaluationQuestionOption>,
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    private readonly evaluationsQuestionOptionsService: EvaluationsQuestionOptionsService,
  ) {}

  async createForm(createFormDto: CreateFormDto) {
    try {
      const evaluation = await this.evaluationRepository.findOne({
        where: { id: createFormDto.evaluation_id },
      });
      if (!evaluation) {
        throw new NotFoundException('Evaluación no encontrada');
      }

      const createdQuestions: Array<EvaluationQuestion & { options: EvaluationQuestionOption[] }> = [];

      for (let i = 0; i < createFormDto.questions.length; i++) {
        const questionData = createFormDto.questions[i];

        const question = this.questionRepository.create({
          evaluationId: createFormDto.evaluation_id,
          label: questionData.label,
          orderIndex: i,
          score: questionData.score || 0,
        });

        const savedQuestion = await this.questionRepository.save(question);

        // Crear las opciones de la pregunta
        const createdOptions = await this.evaluationsQuestionOptionsService.create(questionData.options, savedQuestion.id);

        createdQuestions.push({
          ...savedQuestion,
          options: createdOptions,
        });
      }

      return {
        evaluation_id: createFormDto.evaluation_id,
        questions: createdQuestions,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear el formulario: ${error.message}`);
    }
  }
}
