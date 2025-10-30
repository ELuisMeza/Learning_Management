import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicModule } from './academic-modules.entity';

@Injectable()
export class AcademicModulesService {
  constructor(
    @InjectRepository(AcademicModule)
    private readonly academicModuleRepository: Repository<AcademicModule>,
  ) {}
}
