import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './careers.entity';
import { CreateCareerDto } from './dto/create-career.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';
import { UpdateCareerDto } from './dto/update-career.dto';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
  ) {}

  async create(createCareerDto: CreateCareerDto): Promise<Career> {
    const career = this.careerRepository.create(createCareerDto);
    return await this.careerRepository.save(career);
  }

  async findAll(getAllDto: BasePayloadGetDto): Promise<{ data: Career[], pagination: { page: number, limit: number, total: number, totalPages: number } }> {
    const { page = 1, limit = 10, search } = getAllDto;
    const queryBuilder = this.careerRepository
      .createQueryBuilder('career')

    if (search) {
      queryBuilder.andWhere(
        '(career.name ILIKE :search OR career.code ILIKE :search OR career.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const skip = (page - 1) * limit;

    const [data, total] = await queryBuilder
      .orderBy('career.name', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: data as Career[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updateCareerDto: UpdateCareerDto): Promise<Career> {
    const career = await this.getById(id);
    try {
      Object.assign(career, updateCareerDto);
      return await this.careerRepository.save(career);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getById(id: string): Promise<Career> {
    const career = await this.careerRepository.findOne({ where: { id, status: GlobalStatus.ACTIVE } });
    if (!career) {
      throw new NotFoundException(`Career with ID ${id} not found`);
    }
    return career;
  }

  async getStadistics() {
    const totalActiveCareers = await this.careerRepository.count({
      where: { status: GlobalStatus.ACTIVE }
    });

    const careersByModality = await this.careerRepository.createQueryBuilder('career')
      .select('career.modality', 'modality')
      .addSelect('COUNT(career.id)', 'count')
      .where('career.status = :status', { status: GlobalStatus.ACTIVE })
      .groupBy('career.modality')
      .getRawMany();

    const modalityMap = new Map<string, string>();
    careersByModality.forEach(item => {
      modalityMap.set(item.modality, String(item.count));
    });

    const allModes = [
      TeachingModes.IN_PERSON,
      TeachingModes.ONLINE,
      TeachingModes.HYBRID
    ];

    const byModality = allModes.map(mode => ({
      modality: mode,
      count: modalityMap.get(mode) || '0'
    }));

    return {
      careers: {
        totalActiveCareers: totalActiveCareers || 0,
        byModality
      }
    };
  }
}
