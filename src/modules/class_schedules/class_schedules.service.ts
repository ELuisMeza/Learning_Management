import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-shedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassSchedule } from './class_schedules.entity';
import { Repository } from 'typeorm';
import { ClassesService } from '../classes/classes.service';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';

@Injectable()
export class ClassSchedulesService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly classSchedulesRepository: Repository<ClassSchedule>,
    private readonly classesService: ClassesService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    try {
      const classRegister = await this.classesService.getByIdAndActive(createScheduleDto.classId);
      Object.assign(createScheduleDto, { class: classRegister });
      return await this.classSchedulesRepository.save(createScheduleDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    try {
      await this.getByIdAndActive(id);
      await this.classSchedulesRepository.update(id, updateScheduleDto);
      return await this.getById(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getByIdAndActive(id: string): Promise<ClassSchedule> {
    const classSchedule = await this.classSchedulesRepository.findOne({ where: { id, status: GlobalStatus.ACTIVE } });
    if (!classSchedule) {
      throw new NotFoundException(` ${id} horario de clase no encontrado o no active`);
    }
    return classSchedule;
  }

  async getAllByClassId(classId: string): Promise<ClassSchedule[]> {
    const classRegister = await this.classesService.getByIdAndActive(classId);
    return this.classSchedulesRepository.find({ where: { classId: classRegister.id, status: GlobalStatus.ACTIVE } });
  }

  async getById(id: string): Promise<ClassSchedule> {
    const classSchedule = await this.classSchedulesRepository.findOne({ where: { id } });
    if (!classSchedule) {
      throw new NotFoundException(` ${id} horario de clase no encontrado`);
    }
    return classSchedule;
  }
}
