import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teachers.entity';
import { CreateUpdateTeacherDto } from './dto/create-teacher.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateUpdateTeacherDto): Promise<Teacher> {
    try {
      const payloadTeacher = {
        ...createTeacherDto,
        status: GlobalStatus.ACTIVE,
      };

      return await this.teacherRepository.save(payloadTeacher);      
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateTeacherDto: CreateUpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.getById(id);
    Object.assign(teacher, updateTeacherDto);
    return await this.teacherRepository.save(teacher);
  }

  async getById(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }
}
