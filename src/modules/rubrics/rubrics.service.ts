import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubric } from './rubrics.entity';
import { CreateRubricDto } from './dto/create.dto';
import { UsersService } from '../users/users.service';
import { RubricLevelsService } from '../rubric-levels/rubric-levels.service';
import { RubricCriteriaService } from '../rubric-criteria/rubric-criteria.service';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';
import { transformResponse } from './utils/transform-response';
import { TransformedRubric } from './dto/get-rubrics.dto';

@Injectable()
export class RubricsService {
  constructor(
    @InjectRepository(Rubric)
    private readonly rubricRepository: Repository<Rubric>,
    private readonly userService: UsersService,
    private readonly rubricLevelsService: RubricLevelsService,
    private readonly rubricCriteriaService: RubricCriteriaService,
  ) {}

  async create(createRubricDto: CreateRubricDto, userCreatorId: string): Promise<Rubric> {
    const user = await this.userService.getByIdAndActive(userCreatorId);

    try {
      // Crear y guardar la rúbrica primero
      const rubric = this.rubricRepository.create({
        name: createRubricDto.name,
        description: createRubricDto.description,
        userCreatorId: user.id,
      });
      const savedRubric = await this.rubricRepository.save(rubric);

      // Crear los criterios y sus niveles
      if (createRubricDto.criteria && createRubricDto.criteria.length > 0) {
        for (const criterionDto of createRubricDto.criteria) {
          const criterion = await this.rubricCriteriaService.create(criterionDto, savedRubric.id);

          // Crear los niveles del criterio
          if (criterionDto.levels && criterionDto.levels.length > 0) {
            for (const levelDto of criterionDto.levels) {
              await this.rubricLevelsService.create(levelDto, criterion.id);
            }
          }
        }
      }

      const rubricWithRelations = await this.rubricRepository.findOne({
        where: { id: savedRubric.id },
        relations: ['userCreator'],
      });

      if (!rubricWithRelations) {
        throw new NotFoundException('Rubrica no encontrada después de la creación');
      }

      return rubricWithRelations;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getByUserCreator(
    userCreatorId: string,
    getRubricsDto: BasePayloadGetDto,
  ) {
    const { page = 1, limit = 10, search } = getRubricsDto;
    const queryBuilder = this.rubricRepository
      .createQueryBuilder('rubric')
      .leftJoin('rubric.userCreator', 'userCreator')
      .where('rubric.userCreatorId = :userCreatorId', { userCreatorId });

    if (search) {
      queryBuilder.andWhere(
        '(rubric.name ILIKE :search OR rubric.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;

    const total = await queryBuilder.getCount();

    const { entities, raw } = await queryBuilder
      .orderBy('rubric.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    const data = entities.map((entity, index) => ({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdat: entity.createdAt,
      usercreatorid: entity.userCreatorId,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string): Promise<TransformedRubric> {
    const rubricRows = await this.rubricRepository.createQueryBuilder('r')
      .select([
        'r.id as id',
        'r.name as name',
        'r.description as description',
        'r.created_at as created_at',
        'u.id as user_creator_id',
        'u.name as user_creator_name',
        'u.email as user_creator_email',
        'rc.id as criterion_id',
        'rc.name as criterion_name',
        'rc.description as criterion_description',
        'rc.weight as criterion_weight',
        'rl.id as level_id',
        'rl.name as level_name',
        'rl.description as level_description',
        'rl.score as level_score',
      ])  
      .leftJoin('users', 'u', 'u.id = r.user_creator')
      .leftJoin('rubric_criteria', 'rc', 'rc.rubric_id = r.id')
      .leftJoin('rubric_levels', 'rl', 'rl.criterion_id = rc.id')
      .where('r.id = :id', { id })
      .getRawMany();

    const rubrics = transformResponse(rubricRows);

    if (!rubrics || rubrics.length === 0) {
      throw new NotFoundException(`Rubrica con ID ${id} no encontrada`);
    }
    return rubrics[0];
  }

}
