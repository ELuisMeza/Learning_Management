import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './classes.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { AcademicModulesService } from '../academic-modules/academic-modules.service';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly academicModuleService: AcademicModulesService,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    try {
      await this.academicModuleService.getByIdAndActive(createClassDto.moduleId);
      return await this.classRepository.save(createClassDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    } 
  }

  async getAllByModuleId(moduleId: string): Promise<Class[]> {
    const academicModule = await this.academicModuleService.getByIdAndActive(moduleId);
    return await this.classRepository.find({ where: { moduleId: academicModule.id, status: GlobalStatus.ACTIVE } });
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const classRegister = await this.getByIdAndActive(id);
    try {
      Object.assign(classRegister, updateClassDto);
      return await this.classRepository.save(classRegister);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getByIdAndActive(id: string): Promise<Class> {
    const classRegister = await this.classRepository.findOne({ where: { id, status: GlobalStatus.ACTIVE } });
    if (!classRegister) {
      throw new NotFoundException(` ${id} clase no encontrada`);
    }
    return classRegister;
  }

}
