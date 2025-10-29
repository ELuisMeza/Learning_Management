import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicModule } from './academic-modules.entity';
import { CreateAcademicModuleDto } from './dto/create-academic-module.dto';
import { UpdateAcademicModuleDto } from './dto/update-academic-module.dto';

@Injectable()
export class AcademicModulesService {
  constructor(
    @InjectRepository(AcademicModule)
    private readonly academicModuleRepository: Repository<AcademicModule>,
  ) {}

  async create(createAcademicModuleDto: CreateAcademicModuleDto): Promise<AcademicModule> {
    const academicModule = this.academicModuleRepository.create(createAcademicModuleDto);
    return await this.academicModuleRepository.save(academicModule);
  }

  async findAll(): Promise<AcademicModule[]> {
    return await this.academicModuleRepository.find({
      relations: ['cycle'],
    });
  }

  async findOne(id: string): Promise<AcademicModule> {
    const academicModule = await this.academicModuleRepository.findOne({
      where: { id },
      relations: ['cycle'],
    });

    if (!academicModule) {
      throw new NotFoundException(`AcademicModule with ID ${id} not found`);
    }

    return academicModule;
  }

  async update(
    id: string,
    updateAcademicModuleDto: UpdateAcademicModuleDto,
  ): Promise<AcademicModule> {
    const academicModule = await this.findOne(id);
    Object.assign(academicModule, updateAcademicModuleDto);
    return await this.academicModuleRepository.save(academicModule);
  }

  async remove(id: string): Promise<void> {
    const academicModule = await this.findOne(id);
    await this.academicModuleRepository.remove(academicModule);
  }
}
