import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassStudent } from './class-students.entity';
import { CreateClassStudentDto } from './dto/create-class-student.dto';
import { UpdateClassStudentDto } from './dto/update-class-student.dto';

@Injectable()
export class ClassStudentsService {
  constructor(
    @InjectRepository(ClassStudent)
    private readonly classStudentRepository: Repository<ClassStudent>,
  ) {}

  async create(createClassStudentDto: CreateClassStudentDto): Promise<ClassStudent> {
    const classStudent = this.classStudentRepository.create(createClassStudentDto);
    return await this.classStudentRepository.save(classStudent);
  }

  async findAll(): Promise<ClassStudent[]> {
    return await this.classStudentRepository.find({
      relations: ['class', 'student'],
    });
  }

  async findByClassAndStudent(classId: string, studentId: string): Promise<ClassStudent> {
    const classStudent = await this.classStudentRepository.findOne({
      where: { classId, studentId },
      relations: ['class', 'student'],
    });

    if (!classStudent) {
      throw new NotFoundException(
        `ClassStudent with classId ${classId} and studentId ${studentId} not found`,
      );
    }

    return classStudent;
  }

  async update(
    classId: string,
    studentId: string,
    updateClassStudentDto: UpdateClassStudentDto,
  ): Promise<ClassStudent> {
    const classStudent = await this.findByClassAndStudent(classId, studentId);
    Object.assign(classStudent, updateClassStudentDto);
    return await this.classStudentRepository.save(classStudent);
  }

  async remove(classId: string, studentId: string): Promise<void> {
    const classStudent = await this.findByClassAndStudent(classId, studentId);
    await this.classStudentRepository.remove(classStudent);
  }
}
