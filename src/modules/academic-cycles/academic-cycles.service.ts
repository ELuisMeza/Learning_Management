import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicCycle } from './academic-cycles.entity';
import { CreateAcademicCycleDto } from './dto/create-academic-cycle.dto';
import { UpdateAcademicCycleDto } from './dto/update-academic-cycle.dto';

@Injectable()
export class AcademicCyclesService {
  constructor(
    @InjectRepository(AcademicCycle)
    private readonly academicCycleRepository: Repository<AcademicCycle>,
  ) {}

  async create(createAcademicCycleDto: CreateAcademicCycleDto): Promise<AcademicCycle> {
    const academicCycle = this.academicCycleRepository.create(createAcademicCycleDto);
    return await this.academicCycleRepository.save(academicCycle);
  }

  async findAll(): Promise<AcademicCycle[]> {
    return await this.academicCycleRepository.find({
      relations: ['career'],
    });
  }

  async findOne(id: string): Promise<AcademicCycle> {
    const academicCycle = await this.academicCycleRepository.findOne({
      where: { id },
      relations: ['career'],
    });

    if (!academicCycle) {
      throw new NotFoundException(`AcademicCycle with ID ${id} not found`);
    }

    return academicCycle;
  }

  async update(
    id: string,
    updateAcademicCycleDto: UpdateAcademicCycleDto,
  ): Promise<AcademicCycle> {
    const academicCycle = await this.findOne(id);
    Object.assign(academicCycle, updateAcademicCycleDto);
    return await this.academicCycleRepository.save(academicCycle);
  }

  async remove(id: string): Promise<void> {
    const academicCycle = await this.findOne(id);
    await this.academicCycleRepository.remove(academicCycle);
  }
}
