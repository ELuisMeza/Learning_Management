import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './evaluations.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { GetEvaluationsDto } from './dto/get.dto';
import { SubmitRubricDto } from './dto/submit-rubric.dto';
import { UsersService } from '../users/users.service';
import { ClassStudentsService } from '../class-students/class-students.service';
import { RubricsService } from '../rubrics/rubrics.service';
import { EvaluationResultsService } from '../evaluation-results/evaluation-results.service';
import { RubricLevel } from '../rubric-levels/rubric-levels.entity';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(RubricLevel)
    private readonly rubricLevelRepository: Repository<RubricLevel>,
    private readonly usersService: UsersService,
    private readonly classStudentsService: ClassStudentsService,
    private readonly rubricsService: RubricsService,
    private readonly evaluationResultsService: EvaluationResultsService,
  ) {}

  async create(createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
    const evaluation = this.evaluationRepository.create(createEvaluationDto);
    return this.evaluationRepository.save(evaluation);
  }

  async getMineTeacher(teacherId: string, getEvaluationsDto: GetEvaluationsDto) {
    const { page = 1, limit = 10, search, classId, evaluationMode, evaluationTypeId, rubricId, startDate, endDate } = getEvaluationsDto;
    const teacher = await this.usersService.getTeacherById(teacherId);
    const queryBuilder = this.evaluationRepository.createQueryBuilder('evaluation')
      .leftJoin('classes', 'c', 'c.id = evaluation.class_id')
      .leftJoin('evaluation_types', 'et', 'et.id = evaluation.evaluation_type_id')
      .leftJoin('rubrics', 'r', 'r.id = evaluation.rubric_id')
      .leftJoin('teachers', 't', 't.id = c.teacher_id')
      .addSelect('c.name', 'className')
      .addSelect('et.name', 'evaluationTypeName')
      .addSelect('r.name', 'rubricName')
      .where('t.id = :teacherId', { teacherId: teacher.id })

    if (search) {
      queryBuilder.andWhere(
        '(evaluation.name ILIKE :search OR evaluation.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (classId) {
      queryBuilder.andWhere('evaluation.class_id = :classId', { classId });
    }

    if (evaluationMode) {
      queryBuilder.andWhere('evaluation.evaluation_mode = :evaluationMode', { evaluationMode });
    }

    if (evaluationTypeId) {
      queryBuilder.andWhere('evaluation.evaluation_type_id = :evaluationTypeId', { evaluationTypeId });
    }

    if (rubricId) {
      queryBuilder.andWhere('evaluation.rubric_id = :rubricId', { rubricId });
    }

    if (startDate) {
      queryBuilder.andWhere('evaluation.start_date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('evaluation.end_date <= :endDate', { endDate });
    }

    const skip = (page - 1) * limit;

    const total = await queryBuilder.getCount();

    const { entities, raw } = await queryBuilder
      .orderBy('evaluation.name', 'ASC')
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    return {
      data: entities.map((entity, index) => ({
        ...entity,
        className: raw[index].className,
        evaluationTypeName: raw[index].evaluationTypeName,
        rubricName: raw[index].rubricName || null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener evaluaciones del estudiante autenticado
   * Retorna todas las evaluaciones de las clases donde el estudiante está matriculado
   * Incluye información sobre si el estudiante ya completó cada evaluación
   */
  async getMyEvaluations(studentId: string): Promise<any[]> {
    // Verificar que el usuario es estudiante
    await this.usersService.isStudent(studentId);

    // Obtener todas las clases del estudiante
    const classStudents = await this.classStudentsService.getClassesByStudentId(studentId);
    const classIds = classStudents.map(cs => cs.classId);

    if (classIds.length === 0) {
      return [];
    }

    // Obtener todas las evaluaciones de esas clases
    const evaluations = await this.evaluationRepository
      .createQueryBuilder('evaluation')
      .leftJoinAndSelect('evaluation.class', 'class')
      .leftJoinAndSelect('evaluation.evaluationType', 'evaluationType')
      .leftJoinAndSelect('evaluation.rubric', 'rubric')
      .where('evaluation.classId IN (:...classIds)', { classIds })
      .andWhere('evaluation.status = :status', { status: 'active' })
      .orderBy('evaluation.startDate', 'DESC')
      .getMany();

    // Verificar para cada evaluación si el estudiante ya la completó
    const evaluationsWithStatus = await Promise.all(
      evaluations.map(async (evaluation) => {
        const result = await this.evaluationResultsService.getResultByStudentAndEvaluation(
          evaluation.id,
          studentId,
        );

        return {
          ...evaluation,
          completed: !!result,
          resultId: result ? `${evaluation.id}-${studentId}` : null,
          resultScore: result?.score || null,
          resultEvaluatedAt: result?.evaluatedAt?.toISOString() || null,
        };
      }),
    );

    return evaluationsWithStatus;
  }

  /**
   * Obtener una evaluación por ID con todas sus relaciones
   */
  async getByIdWithRelations(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id },
      relations: ['class', 'evaluationType', 'rubric'],
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }

    return evaluation;
  }

  /**
   * Enviar evaluación con rúbrica
   */
  async submitRubricEvaluation(
    evaluationId: string,
    evaluatorId: string,
    submitRubricDto: SubmitRubricDto,
  ) {
    // Verificar que la evaluación existe
    const evaluation = await this.getByIdWithRelations(evaluationId);

    if (!evaluation.rubricId) {
      throw new BadRequestException('Esta evaluación no tiene una rúbrica asignada');
    }

    // Obtener la rúbrica con sus criterios y niveles
    const rubric = await this.rubricsService.getById(evaluation.rubricId);

    // Determinar quién es evaluado
    // Si es autoevaluación, el evaluado es el mismo evaluador
    // Si es coevaluación, usar evaluatedId del DTO
    const evaluatedId = submitRubricDto.evaluatedId || evaluatorId;

    // Verificar que se evaluaron todos los criterios
    if (submitRubricDto.scores.length !== rubric.criteria.length) {
      throw new BadRequestException('Debes evaluar todos los criterios de la rúbrica');
    }

    // Calcular puntaje total
    let totalScore = 0;
    const validatedScores: Array<{
      criteriaId: string;
      levelId: string;
      score: number;
      weightedScore: number;
    }> = [];

    for (const scoreDto of submitRubricDto.scores) {
      // Verificar que el criterio existe en la rúbrica
      const criterion = rubric.criteria.find(c => c.id === scoreDto.criteriaId);
      if (!criterion) {
        throw new BadRequestException(`El criterio ${scoreDto.criteriaId} no pertenece a esta rúbrica`);
      }

      // Verificar que el nivel existe y pertenece al criterio
      const level = criterion.levels.find(l => l.id === scoreDto.levelId);
      if (!level) {
        throw new BadRequestException(`El nivel ${scoreDto.levelId} no pertenece al criterio ${scoreDto.criteriaId}`);
      }

      // Calcular puntaje ponderado: score del nivel * weight del criterio
      const weightedScore = parseFloat(level.score.toString()) * parseFloat(criterion.weight.toString());
      totalScore += weightedScore;

      validatedScores.push({
        criteriaId: scoreDto.criteriaId,
        levelId: scoreDto.levelId,
        score: parseFloat(level.score.toString()),
        weightedScore,
      });
    }

    // Normalizar el puntaje al máximo de la evaluación
    // El puntaje máximo teórico sería la suma de (max score de cada nivel * weight del criterio)
    const maxPossibleScore = rubric.criteria.reduce((sum, criterion) => {
      const maxLevelScore = Math.max(...criterion.levels.map(l => parseFloat(l.score.toString())));
      return sum + (maxLevelScore * parseFloat(criterion.weight.toString()));
    }, 0);

    // Calcular porcentaje y escalar al maxScore de la evaluación
    const percentageScore = maxPossibleScore > 0
      ? (totalScore / maxPossibleScore) * parseFloat(evaluation.maxScore.toString())
      : 0;

    // Guardar el resultado
    await this.evaluationResultsService.saveResult(evaluationId, evaluatedId, percentageScore, {
      evaluatorId,
      scores: validatedScores,
      comments: submitRubricDto.comments,
    });

    return {
      evaluationId,
      evaluatedId,
      evaluatorId,
      totalScore: percentageScore,
      maxScore: parseFloat(evaluation.maxScore.toString()),
      scores: validatedScores,
      comments: submitRubricDto.comments,
    };
  }
}
