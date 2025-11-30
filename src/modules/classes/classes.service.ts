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

@Injectable()
export class ClassesService {

  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly academicModuleService: AcademicModulesService,
    private readonly usersService: UsersService,
  ) {}

  async create(createClassDto: CreateClassDto, teacherId?: string): Promise<Class> {
    try {
      // Validar que se proporcione moduleId
      if (!createClassDto.moduleId) {
        throw new BadRequestException('El moduleId es requerido para crear una clase. Por favor, proporciona un módulo académico válido.');
      }
      
      await this.academicModuleService.getByIdAndActive(createClassDto.moduleId);
      
      // Obtener el teacherId del usuario si no se proporciona
      let finalTeacherId = teacherId;
      if (teacherId) {
        const user = await this.usersService.getByIdAndActive(teacherId);
        finalTeacherId = user.teacherId || undefined;
      }
      
      // Generar código automáticamente si no se proporciona
      let code = createClassDto.code;
      if (!code || code.trim() === '') {
        code = this.generateClassCode();
      }
      
      const classData: Partial<Class> = {
        name: createClassDto.name,
        description: createClassDto.description || '',
        credits: createClassDto.credits || 0,
        maxStudents: createClassDto.maxStudents || 30,
        status: createClassDto.status || GlobalStatus.ACTIVE,
        typeTeaching: createClassDto.typeTeaching || TeachingModes.IN_PERSON,
        code: code.toUpperCase(),
        moduleId: createClassDto.moduleId,
        teacherId: finalTeacherId,
      };
      
      return await this.classRepository.save(classData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    } 
  }

  /**
   * Genera un código único para la clase
   * Formato: 3 letras aleatorias + 3 números
   */
  private generateClassCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let code = '';
    // 3 letras aleatorias
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // 3 números aleatorios
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
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
      relations: ['module', 'teacher', 'teacher.user'],
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
  async getAllByTeacherId(teacherId: string): Promise<Class[]> {
    const user = await this.usersService.getByIdAndActive(teacherId);
    if (!user.teacherId) {
      throw new BadRequestException('El usuario no es un docente');
    }
    
    return await this.classRepository.find({
      where: { teacherId: user.teacherId, status: GlobalStatus.ACTIVE },
      relations: ['module', 'teacher'],
      order: { createdAt: 'DESC' },
    });
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

}
