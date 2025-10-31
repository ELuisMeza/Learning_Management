import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicCycle } from './academic-cycles.entity';
import { CreateAcademicCycleDto } from './dto/create-cycles.dto';
import { CareersService } from '../careers/careers.service';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { UpdateAcademicCycleDto } from './dto/update-cycles';

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
      throw new NotFoundException(` ${id} ciclo académico no encontrado o no activo`);
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
}
