import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassStudent } from './class-students.entity';
import { EnrollmentStatus } from 'src/globals/enums/enrollment-status.enum';
import { CreateRelationDto } from './dto/create-relation.dto';
import { ClassesService } from '../classes/classes.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';

@Injectable()
export class ClassStudentsService {
  constructor(
    @InjectRepository(ClassStudent)
    private readonly classStudentRepository: Repository<ClassStudent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async matriculateStudentByQR(classId: string, studentId: string): Promise<ClassStudent> {
    try {
      const classStudent = await this.studentIsMatriculated(classId, studentId);

      if (classStudent) {
        throw new ConflictException('El estudiante ya está matriculado en esta clase');
      }

      const studentRegister = await this.usersService.isStudent(studentId);

      const classSelected = await this.classesService.getByIdAndActive(classId);

      const currentCantStudents = await this.getCurrentCantStudentsByClassId(classId);
      if (currentCantStudents >= classSelected.maxStudents) {
        throw new ConflictException(`La clase ${classSelected.name} ya tiene el máximo de estudiantes permitidos: ${classSelected.maxStudents}`);
      }

      const newClassStudent: Partial<ClassStudent> = {
        classId: classSelected.id,
        studentId: studentRegister.id,
        userModifiedId: studentId,
      };

      try {
        return await this.classStudentRepository.save(newClassStudent);
      } catch (error: any) {
        console.error('[ClassStudentsService] Error al guardar ClassStudent:', error);
        console.error('[ClassStudentsService] Detalles del error:', {
          message: error.message,
          code: error.code,
          detail: error.detail,
          constraint: error.constraint,
        });
        throw new InternalServerErrorException(
          error.detail || error.message || 'Error al inscribir al estudiante en la clase'
        );
      }
    } catch (error) {
      // Re-lanzar excepciones de NestJS (ConflictException, BadRequestException, etc.)
      if (error instanceof ConflictException || error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      // Para otros errores, envolver en InternalServerErrorException
      console.error('[ClassStudentsService] Error inesperado en matriculateStudentByQR:', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Error inesperado al inscribir al estudiante'
      );
    }
  }

  /**
   * Obtiene todos los estudiantes de una clase
   */
  async getStudentsByClassId(classId: string): Promise<ClassStudent[]> {
    // Verificar que la clase existe
    await this.classesService.getByIdAndActive(classId);
    
    return await this.classStudentRepository.find({
      where: { classId },
      relations: ['student'],
      order: { enrollmentDate: 'DESC' },
    });
  }

  /**
   * Obtiene todas las clases de un estudiante
   */
  async getClassesByStudentId(studentId: string): Promise<ClassStudent[]> {
    try {
      // Verificar que el usuario existe y está activo
      const user = await this.usersService.getByIdAndActive(studentId);
      
      // Si el usuario no es estudiante, retornar array vacío
      // Esto permite que cualquier usuario vea sus clases (si las tiene)
      if (!user.role || user.role.name !== 'Estudiante') {
        return [];
      }
      
      // Obtener las clases con todas las relaciones necesarias
      const classStudents = await this.classStudentRepository.find({
        where: { studentId },
        relations: ['class', 'class.module', 'class.teacher'],
        order: { enrollmentDate: 'DESC' },
      });

      // Para cada clase, obtener el User del docente (si existe)
      // porque Class.teacher es Teacher, pero necesitamos User para obtener name y lastNameFather
      for (const classStudent of classStudents) {
        if (classStudent.class?.teacher?.id) {
          // Buscar el User que tiene teacherId = class.teacher.id
          const teacherUser = await this.userRepository.findOne({
            where: { teacherId: classStudent.class.teacher.id },
            relations: ['role'],
          });
          if (teacherUser) {
            // Reemplazar teacher (Teacher) con teacher (User) para que el frontend pueda acceder a name y lastNameFather
            (classStudent.class as any).teacher = teacherUser;
          }
        }
      }

      return classStudents;
    } catch (error) {
      // Si hay algún error, retornar array vacío en lugar de propagar el error
      console.error('Error al obtener clases del estudiante:', error);
      return [];
    }
  }

  async getStadisticsStudentsMatriculated() {
    const data = await this.classStudentRepository.createQueryBuilder('classStudent')
    .select('class.module.name', 'moduleName')
    .addSelect('COUNT(classStudent.classId)', 'count')
    .groupBy('class.module.name')
    .getRawMany();
    return data;
  }
}
