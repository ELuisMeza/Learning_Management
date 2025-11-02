import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicModule } from './academic-modules.entity';
import { CreateAcademicModuleDto } from './dto/create-module.dto';
import { UpdateAcademicModuleDto } from './dto/update-module.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { AcademicCyclesService } from '../academic-cycles/academic-cycles.service';

@Injectable()
export class AcademicModulesService {
  constructor(
    @InjectRepository(AcademicModule)
    private readonly academicModuleRepository: Repository<AcademicModule>,
    private readonly academicCycleService: AcademicCyclesService,
  ) {}

  async create(createAcademicModuleDto: CreateAcademicModuleDto): Promise<AcademicModule> {
    const academicModule = this.academicModuleRepository.create(createAcademicModuleDto);
    return await this.academicModuleRepository.save(academicModule);
  }

  async update(id: string, updateAcademicModuleDto: UpdateAcademicModuleDto): Promise<AcademicModule> {
    const academicModule = await this.getById(id);
    Object.assign(academicModule, updateAcademicModuleDto);
    return await this.academicModuleRepository.save(academicModule);
  }

  async getById(id: string): Promise<AcademicModule> {
    const academicModule = await this.academicModuleRepository.findOne({ where: { id } });
    if (!academicModule) {
      throw new NotFoundException(` ${id} módulo académico no encontrado`);
    }
    return academicModule;
  }

  async getByIdAndActive(id: string): Promise<AcademicModule> {
    const academicModule = await this.academicModuleRepository.findOne({ where: { id, status: GlobalStatus.ACTIVE } });
    if (!academicModule) {
      throw new NotFoundException(` ${id} módulo académico no encontrado o no active`);
    }
    return academicModule;
  }

  async getByCycleId(cycleId: string): Promise<AcademicModule[]> {
    const academicCycle = await this.academicCycleService.getByIdAndActive(cycleId);

    const academicModules = await this.academicModuleRepository.find({ where: { cycleId: academicCycle.id } });

    return academicModules;
  }
}
