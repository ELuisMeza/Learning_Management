import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationAnswer } from './evaluation_answers.entity';
import { EvaluationQuestion } from '../evaluations_questions/evaluations_questions.entity';
import { EvaluationQuestionOption } from '../evaluations_question_options/evaluations_question_options.entity';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { EvaluationsQuestionsService } from '../evaluations_questions/evaluations_questions.service';
import { EvaluationsService } from '../evaluations/evaluations.service';
import { EvaluationResultsService } from '../evaluation-results/evaluation-results.service';

@Injectable()
export class EvaluationAnswersService {
  constructor(
    @InjectRepository(EvaluationAnswer)
    private readonly answerRepository: Repository<EvaluationAnswer>,
    @InjectRepository(EvaluationQuestion)
    private readonly questionRepository: Repository<EvaluationQuestion>,
    @InjectRepository(EvaluationQuestionOption)
    private readonly optionRepository: Repository<EvaluationQuestionOption>,
    private readonly evaluationsQuestionsService: EvaluationsQuestionsService,
    private readonly evaluationsService: EvaluationsService,
    private readonly evaluationResultsService: EvaluationResultsService,
  ) {}

  /**
   * Enviar respuestas de examen y calificar automáticamente
   */
  async submitExamAnswers(evaluationId: string, studentId: string, submitExamDto: SubmitExamDto) {
    // Verificar que la evaluación existe
    const evaluation = await this.evaluationsService.getByIdWithRelations(evaluationId);
    
    // Obtener todas las preguntas de la evaluación
    const questions = await this.evaluationsQuestionsService.getQuestionsByEvaluationId(evaluationId);

    if (questions.length === 0) {
      throw new BadRequestException('La evaluación no tiene preguntas');
    }

    // Verificar que se respondieron todas las preguntas
    if (submitExamDto.answers.length !== questions.length) {
      throw new BadRequestException('Debes responder todas las preguntas');
    }

    // Calcular puntaje
    let totalScore = 0;
    let correctAnswers = 0;
    const savedAnswers: EvaluationAnswer[] = [];

    for (const answer of submitExamDto.answers) {
      // Verificar que la pregunta existe y pertenece a la evaluación
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) {
        throw new BadRequestException(`La pregunta ${answer.questionId} no pertenece a esta evaluación`);
      }

      // Verificar que la opción existe y pertenece a la pregunta
      const option = question.options.find(opt => opt.id === answer.optionId);
      if (!option) {
        throw new BadRequestException(`La opción ${answer.optionId} no pertenece a la pregunta ${answer.questionId}`);
      }

      // Guardar la respuesta
      const evaluationAnswer = this.answerRepository.create({
        userId: studentId,
        questionId: answer.questionId,
        optionId: answer.optionId,
      });
      const savedAnswer = await this.answerRepository.save(evaluationAnswer);
      savedAnswers.push(savedAnswer);

      // Si la respuesta es correcta, sumar puntos
      if (option.isCorrect) {
        correctAnswers++;
        totalScore += question.score || 0;
      }
    }

    // Calcular el porcentaje del puntaje máximo
    const maxScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);
    const percentageScore = maxScore > 0 ? (totalScore / maxScore) * parseFloat(evaluation.maxScore.toString()) : 0;

    // Guardar el resultado en evaluation_results
    await this.evaluationResultsService.saveResult(evaluationId, studentId, percentageScore, {
      totalQuestions: questions.length,
      correctAnswers,
      totalScore,
      maxScore,
    });

    return {
      evaluationId,
      totalScore: percentageScore,
      maxScore: parseFloat(evaluation.maxScore.toString()),
      correctAnswers,
      totalQuestions: questions.length,
      answers: savedAnswers,
    };
  }
}
