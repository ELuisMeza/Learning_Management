import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teachers.entity';
import { CreateUpdateTeacherDto } from './dto/create-teacher.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';

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

  async getStadisticsTeachers() {
    const totalActiveTeachers = await this.teacherRepository.count({
      where: { status: GlobalStatus.ACTIVE }
    });

    const teachersByTeachingMode = await this.teacherRepository.createQueryBuilder('teacher')
      .select('teacher.teachingModes', 'teachingModes')
      .addSelect('COUNT(teacher.id)', 'count')
      .where('teacher.status = :status', { status: GlobalStatus.ACTIVE })
      .groupBy('teacher.teachingModes')
      .getRawMany();

    const modeMap = new Map<string, string>();
    teachersByTeachingMode.forEach(item => {
      modeMap.set(item.teachingModes, String(item.count));
    });

    const allModes = [
      TeachingModes.IN_PERSON,
      TeachingModes.ONLINE,
      TeachingModes.HYBRID
    ];

    const byTeachingMode = allModes.map(mode => ({
      teachingModes: mode,
      count: modeMap.get(mode) || '0'
    }));

    return {
      teachers: {
        totalActiveTeachers: totalActiveTeachers || 0,
        byTeachingMode
      }
    };
  }

  async getAll(getAllDto: BasePayloadGetDto): Promise<{ data: Teacher[], pagination: { page: number, limit: number, total: number, totalPages: number } }> {
    const { page = 1, limit = 10, search } = getAllDto;
    const queryBuilder = this.teacherRepository
      .createQueryBuilder('teacher')
      .where('teacher.status = :status', { status: GlobalStatus.ACTIVE });

    if (search) {
      queryBuilder.andWhere(
        '(teacher.appellative ILIKE :search OR teacher.specialty ILIKE :search OR teacher.academicDegree ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const skip = (page - 1) * limit;

    const [data, total] = await queryBuilder
      .orderBy('teacher.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
