import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './evaluations.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { GetEvaluationsDto } from './dto/get.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    private readonly usersService: UsersService,
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
}
