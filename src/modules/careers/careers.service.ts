import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './careers.entity';
import { CreateCareerDto } from './dto/create-career.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';
import { UpdateCareerDto } from './dto/update-career.dto';

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

  async findAll(): Promise<Career[]> {
    return await this.careerRepository.find({ where: { status: GlobalStatus.ACTIVE } });
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
