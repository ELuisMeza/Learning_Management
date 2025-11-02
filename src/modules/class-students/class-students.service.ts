import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassStudent } from './class-students.entity';
import { EnrollmentStatus } from 'src/globals/enums/enrollment-status.enum';
import { CreateRelationDto } from './dto/create-relation.dto';
import { ClassesService } from '../classes/classes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ClassStudentsService {
  constructor(
    @InjectRepository(ClassStudent)
    private readonly classStudentRepository: Repository<ClassStudent>,
    private readonly classesService: ClassesService,
    private readonly usersService: UsersService,
  ) {}


  async matriculateStudent(matriculateStudentDto: CreateRelationDto, studentId: string): Promise<ClassStudent> {
    const classStudent = await this.studentIsMatriculated(matriculateStudentDto.classId, studentId);

    if (classStudent) {
      throw new ConflictException('El estudiante ya está matriculado en esta clase');
    }

    const studentRegister = await this.usersService.isStudent(studentId);

    const classSelected = await this.classesService.getByIdAndActive(matriculateStudentDto.classId);

    const currentCantStudents = await this.getCurrentCantStudentsByClassId(matriculateStudentDto.classId);
    if (currentCantStudents >= classSelected.maxStudents) {
      throw new ConflictException(`La clase ${classSelected.name} ya tiene el máximo de estudiantes permitidos: ${classSelected.maxStudents}`);
    }

    const newClassStudent: Partial<ClassStudent> = {
      classId: classSelected.id,
      studentId: studentRegister.id,
      class: classSelected,
      student: studentRegister,
      userModifiedId: studentId,
      userModified: studentRegister,
    };

    try {
      return await this.classStudentRepository.save(newClassStudent);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  async studentIsMatriculated(classId: string, studentId: string): Promise<boolean> {
    const classStudent = await this.classStudentRepository.findOne({ where: { classId, studentId } });
    return classStudent ? true : false;
  }

  async getCurrentCantStudentsByClassId(classId: string): Promise<number> {
    const classStudents = await this.classStudentRepository.find({ where: { classId, status: EnrollmentStatus.IN_COURSE } });
    return classStudents.length;
  }
}
