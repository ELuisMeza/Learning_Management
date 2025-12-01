import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicCycle } from './academic-cycles.entity';
import { CreateAcademicCycleDto } from './dto/create-cycles.dto';
import { CareersService } from '../careers/careers.service';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { UpdateAcademicCycleDto } from './dto/update-cycles';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';

@Injectable()
export class AcademicCyclesService {
  constructor(
    @InjectRepository(AcademicCycle)
    private readonly academicCycleRepository: Repository<AcademicCycle>,
    private readonly careersService: CareersService,
  ) {}

  async create(createAcademicCycleDto: CreateAcademicCycleDto): Promise<AcademicCycle> {
    await this.careersService.getById(createAcademicCycleDto.careerId);

    const academicCycle = this.academicCycleRepository.create(createAcademicCycleDto);
    
    return await this.academicCycleRepository.save(academicCycle);
  }

  async update(id: string, updateAcademicCycleDto: UpdateAcademicCycleDto): Promise<AcademicCycle> {
    const academicCycle = await this.getById(id);

    try {
      Object.assign(academicCycle, updateAcademicCycleDto);
      return await this.academicCycleRepository.save(academicCycle);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getByCareerId(careerId: string): Promise<AcademicCycle[]> {
    return await this.academicCycleRepository.find({ where: { status: GlobalStatus.ACTIVE, careerId } });
  }

  async getByIdAndActive(id: string): Promise<AcademicCycle> {
    const academicCycle = await this.academicCycleRepository.findOne({ where: { id, status: GlobalStatus.ACTIVE } });
    if (!academicCycle) {
      throw new NotFoundException(` ${id} ciclo académico no encontrado o no active`);
    }
    return academicCycle;
  }

  async getById(id: string): Promise<AcademicCycle> {
    const academicCycle = await this.academicCycleRepository.findOne({ where: { id } });
    if (!academicCycle) {
      throw new NotFoundException(` ${id} ciclo académico no encontrado`);
    }
    return academicCycle;
  }

  async getAll(getAllDto: BasePayloadGetDto) {
    const { page = 1, limit = 10, search } = getAllDto;
    const queryBuilder = this.academicCycleRepository
      .createQueryBuilder('cycle')
      .addSelect('career.name', 'careerName')
      .leftJoin('cycle.career', 'career')
      .where('cycle.status = :status', { status: GlobalStatus.ACTIVE });

    if (search) {
      queryBuilder.andWhere(
        '(cycle.name ILIKE :search OR cycle.code ILIKE :search OR cycle.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const skip = (page - 1) * limit;

    const total = await queryBuilder.getCount();

    const { entities, raw } = await queryBuilder
      .orderBy('cycle.orderNumber', 'ASC')
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    const data = entities.map((entity, index) => ({
      ...entity,
      careerName: raw[index].careerName,
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
}
