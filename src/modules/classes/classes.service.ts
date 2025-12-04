import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './classes.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';
import { AcademicModulesService } from '../academic-modules/academic-modules.service';
import { UpdateClassDto } from './dto/update-class.dto';
import { UsersService } from '../users/users.service';
import * as QRCode from 'qrcode';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';
import { GetClassesByTeacherIdDto, GetClassesDto } from './dto/get-clasees.dto';

@Injectable()
export class ClassesService {

  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly academicModuleService: AcademicModulesService,
    private readonly usersService: UsersService,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    try {

      await this.academicModuleService.getByIdAndActive(createClassDto.moduleId);
      
      
      const classData: Partial<Class> = {
        name: createClassDto.name,
        description: createClassDto.description || '',
        credits: createClassDto.credits || 0,
        maxStudents: createClassDto.maxStudents || 30,
        status: GlobalStatus.ACTIVE,
        typeTeaching: createClassDto.typeTeaching || TeachingModes.IN_PERSON,
        code: createClassDto.code.toUpperCase(),
        moduleId: createClassDto.moduleId,
        teacherId: createClassDto.teacherId || undefined,
      };
      
      return await this.classRepository.save(classData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
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
    const classRegister = await this.classRepository.findOne({
      where: { id, status: GlobalStatus.ACTIVE },
      relations: ['module', 'teacher'],
    });
    if (!classRegister) {
      throw new NotFoundException(`Clase con ID ${id} no encontrada`);
    }
    return classRegister;
  }

  async generateQRCode(classId: string): Promise<{ qrCode: string; url: string; code: string }> {
    const classRegister = await this.getByIdAndActive(classId);
    try {
      // Obtener la URL del frontend desde las variables de entorno
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      // Crear URL que redirige al frontend con el código de la clase
      // El frontend manejará la inscripción usando el token del usuario
      const enrollUrl = `${frontendUrl}/scan-qr?code=${classRegister.code}`;
      
      // Generar el código QR como base64 con la URL
      const qrDataURL = await QRCode.toDataURL(enrollUrl);
      
      return {
        qrCode: qrDataURL,
        url: enrollUrl,
        code: classRegister.code,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al generar el código QR');
    }
  }

  /**
   * Obtiene todas las clases de un docente
   */
  async getAllByTeacherId(getAllByTeacherIdDto: GetClassesByTeacherIdDto, userId: string): Promise<{ data: any[], pagination: { page: number, limit: number, total: number, totalPages: number } }> {
    const user = await this.usersService.getByIdAndActive(userId);
    if (!user.teacherId) {
      throw new BadRequestException('El usuario no es un docente');
    }
    const { moduleId, cycleId, careerId, typeTeaching, page = 1, limit = 10 } = getAllByTeacherIdDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.classRepository.createQueryBuilder('class')
      .select([
        'class.id as id',
        'class.name as name',
        'class.description as description',
        'class.credits as credits',
        'class.typeTeaching as typeTeaching',
        'class.maxStudents as maxStudents',
        'class.createdAt as createdAt',
        'am.name as moduleName',
        'am.code as moduleCode',
        'ac.id as cycleId',
        'ac.name as cycleName',
        'ac.code as cycleCode',
        'c.id as careerId',
        'c.name as careerName',
        'c.code as careerCode',
      ])
      .leftJoin('academic_modules', 'am', 'am.id = class.moduleId')
      .leftJoin('academic_cycles', 'ac', 'ac.id = am.cycleId')
      .leftJoin('careers', 'c', 'c.id = ac.careerId')
      .leftJoin('teachers', 't', 't.id = class.teacherId')
      .where('class.teacherId = :teacherId', { teacherId: user.teacherId });
      
    if (moduleId) {
      queryBuilder.andWhere('class.moduleId = :moduleId', { moduleId });
    }
    if (cycleId) {
      queryBuilder.andWhere('am.cycleId = :cycleId', { cycleId });
    }
    if (careerId) {
      queryBuilder.andWhere('ac.careerId = :careerId', { careerId });
    }
    if (typeTeaching) {
      queryBuilder.andWhere('class.typeTeaching = :typeTeaching', { typeTeaching });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder.skip(skip).take(limit).getRawMany();

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

  /**
   * Obtiene una clase por su código
   */
  async getByCode(code: string): Promise<Class> {
    const classRegister = await this.classRepository.findOne({
      where: { code: code.toUpperCase(), status: GlobalStatus.ACTIVE },
      relations: ['module', 'teacher'],
    });
    
    if (!classRegister) {
      throw new NotFoundException(`Clase con código ${code} no encontrada`);
    }
    
    return classRegister;
  }

 async getStadistics() {
  const totalActiveClasses = await this.classRepository.count({
    where: { status: GlobalStatus.ACTIVE }
  });

  const classesByTeachingMode = await this.classRepository.createQueryBuilder('class')
    .select('class.typeTeaching', 'typeTeaching')
    .addSelect('COUNT(class.id)', 'count')
    .where('class.status = :status', { status: GlobalStatus.ACTIVE })
    .groupBy('class.typeTeaching')
    .getRawMany();

  const modeMap = new Map<string, string>();
  classesByTeachingMode.forEach(item => {
    modeMap.set(item.typeTeaching, String(item.count));
  });

  const allModes = [
    TeachingModes.IN_PERSON,
    TeachingModes.ONLINE,
    TeachingModes.HYBRID
  ];

  const byTeachingMode = allModes.map(mode => ({
    typeTeaching: mode,
    count: modeMap.get(mode) || '0'
  }));

  return {
    classes: {
      totalActiveClasses: totalActiveClasses || 0,
      byTeachingMode
    }
  };
 }

  async getAll(getAllDto: GetClassesDto): Promise<{ data: Class[], pagination: { page: number, limit: number, total: number, totalPages: number } }> {
    const { page = 1, limit = 10, search, status, moduleId, teacherId, typeTeaching } = getAllDto;
    const queryBuilder = this.classRepository.createQueryBuilder('class')
      .leftJoin('class.module', 'module')
      .leftJoin('class.teacher', 'teacher')
      .addSelect('teacher.appellative', 'appellative')
      .addSelect('module.name', 'moduleName')

    if (search) {
      queryBuilder.andWhere(
        '(class.name ILIKE :search OR class.code ILIKE :search OR class.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('class.status = :status', { status });
    }

    if (moduleId) {
      queryBuilder.andWhere('class.moduleId = :moduleId', { moduleId });
    }

    if (teacherId) {
      queryBuilder.andWhere('class.teacherId = :teacherId', { teacherId });
    }

    if (typeTeaching) {
      queryBuilder.andWhere('class.typeTeaching = :typeTeaching', { typeTeaching });
    }

    const skip = (page - 1) * limit;

    const total = await queryBuilder.getCount();

    const { entities, raw } = await queryBuilder
      .orderBy('class.name', 'ASC')
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    return {
      data: entities.map((entity, index) => ({
        ...entity,
        moduleName: raw[index].moduleName,
        appellative: raw[index].appellative, 
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
