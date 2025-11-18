import { BadRequestException, Injectable, Inject, forwardRef, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { GenderType } from 'src/globals/enums/gender-type.enum';
import { RolesService } from '../roles/roles.service';
import { TeachersService } from '../teachers/teachers.service';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUpdateTeacherDto } from '../teachers/dto/create-teacher.dto';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';
import { GoogleProfileDto } from './dto/google-profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private static readonly DEFAULT_ROLE_NAME = 'Estudiante';
  private static readonly DEFAULT_GENDER = GenderType.OTHER;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly teachersService: TeachersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto, userCreatorId: string): Promise<User> {

    if(await this.existsNumberDocument(createUserDto.documentNumber!)){
      throw new ConflictException('El número de documento ya está registrado');
    }

    if(await this.findByEmail(createUserDto.email) !== null){
      throw new ConflictException('El email ya está registrado');
    }

    const role = await this.rolesService.getById(createUserDto.roleId);
    let newTeacherId: string | undefined;

    if(role.name === 'Docente'){

      if(!createUserDto.teachingModes ){
        throw new BadRequestException('El modo de enseñanza es requerido');
    }

      const payloadTeacher: CreateUpdateTeacherDto = {
        specialty: createUserDto.specialty || '',
        academicDegree: createUserDto.academicDegree || '',
        experienceYears: createUserDto.experienceYears || 0,
        bio: createUserDto.bio || '',
        cvUrl: createUserDto.cvUrl || '',
        teachingModes: createUserDto.teachingModes,
      };

      const teacher = await this.teachersService.create(payloadTeacher);
      newTeacherId = teacher.id;
    }

    const { specialty, academicDegree, experienceYears, bio, cvUrl, teachingModes, ...userData } = createUserDto;

    const password = await this.authService.hashPassword(createUserDto.password);
    
    const payloadUser: Partial<User> = {
      ...userData,
      birthdate: DateTime.fromISO(createUserDto.birthdate).toJSDate(),
      status: GlobalStatus.ACTIVE,
      createdBy: userCreatorId,
      password: password,
    };

    if(newTeacherId){
      payloadUser.teacherId = newTeacherId;
    }

    return await this.userRepository.save(payloadUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, status: GlobalStatus.ACTIVE },
      relations: ['role'],
    });
  }

  async existsNumberDocument(documentNumber: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { documentNumber, status: GlobalStatus.ACTIVE },
    });
    return user ? true : false;
  }

  async getByIdAndActive(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['role', 'teacher'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {

    const user = await this.getByIdAndActive(id);

    if(user.role.name === 'Docente'){


      const payloadTeacher: CreateUpdateTeacherDto = {
        specialty: updateUserDto.specialty || '',
        academicDegree: updateUserDto.academicDegree || '',
        experienceYears: updateUserDto.experienceYears || 0,
        bio: updateUserDto.bio || '',
        cvUrl: updateUserDto.cvUrl || '',
        teachingModes: updateUserDto.teachingModes as TeachingModes || user.teacher.teachingModes,
      };

      await this.teachersService.update(user.teacher.id, payloadTeacher);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async isStudent(id: string): Promise<User> {
    const user = await this.getByIdAndActive(id);
    const isStudent = user.role.name === 'Estudiante';
    if (!isStudent) {
      throw new BadRequestException('El usuario no es un estudiante');
    }
    return user;
  }

  /**
   * Busca o crea un usuario basado en el perfil de Google OAuth
   * @param googleProfile - Perfil del usuario obtenido de Google
   * @returns Usuario existente o recién creado
   */
  async findGoogleUser(googleProfile: GoogleProfileDto): Promise<User> {
    this.validateGoogleProfile(googleProfile);
    
    const { email } = googleProfile;
    
    // Buscar si el usuario ya existe por email
    let user = await this.findByEmail(email);

    if (!user) {
      this.logger.log(`Usuario no encontrado para email: ${email}. Creando nuevo usuario automáticamente.`);
      user = await this.createUserFromGoogleProfile(googleProfile);
      this.logger.log(`Usuario creado exitosamente con ID: ${user.id}`);
    } else {
      this.logger.log(`Usuario existente encontrado para email: ${email}`);
    }
    
    return user;
  }

  /**
   * Valida que el perfil de Google contenga los datos necesarios
   * @param googleProfile - Perfil a validar
   * @throws BadRequestException si faltan datos requeridos
   */
  private validateGoogleProfile(googleProfile: GoogleProfileDto): void {
    if (!googleProfile?.email) {
      throw new BadRequestException('El perfil de Google debe contener un email');
    }

    if (!googleProfile.firstName && !googleProfile.lastName) {
      throw new BadRequestException('El perfil de Google debe contener al menos un nombre o apellido');
    }
  }

  /**
   * Crea un nuevo usuario a partir del perfil de Google
   * @param googleProfile - Perfil del usuario de Google
   * @returns Usuario recién creado con todas sus relaciones
   */
  private async createUserFromGoogleProfile(googleProfile: GoogleProfileDto): Promise<User> {
    try {
      // Obtener el rol por defecto (Estudiante)
      const defaultRole = await this.rolesService.getByName(UsersService.DEFAULT_ROLE_NAME);
      
      // Preparar los datos del usuario
      const userData = this.prepareUserDataFromGoogle(googleProfile, defaultRole.id);
      
      // Guardar el usuario
      const newUser = await this.userRepository.save(userData);
      
      // Cargar las relaciones para retornar el usuario completo
      return await this.getByIdAndActive(newUser.id);
    } catch (error) {
      this.logger.error(`Error al crear usuario desde Google: ${error.message}`, error.stack);
      
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new BadRequestException('Error al crear el usuario desde Google. Por favor, intenta nuevamente.');
    }
  }

  /**
   * Prepara los datos del usuario a partir del perfil de Google
   * @param googleProfile - Perfil del usuario de Google
   * @param roleId - ID del rol a asignar
   * @returns Datos del usuario listos para guardar
   */
  private prepareUserDataFromGoogle(
    googleProfile: GoogleProfileDto,
    roleId: string,
  ): Partial<User> {
    return {
      name: this.sanitizeName(googleProfile.firstName) || 'Usuario',
      lastNameFather: this.sanitizeName(googleProfile.lastName) || 'Google',
      lastNameMother: undefined,
      email: googleProfile.email.toLowerCase().trim(),
      password: undefined, // No se requiere password para login con Google
      status: GlobalStatus.ACTIVE,
      gender: UsersService.DEFAULT_GENDER,
      birthdate: undefined,
      phone: undefined,
      documentType: undefined,
      documentNumber: undefined,
      roleId: roleId,
      createdBy: undefined, // Auto-creado por Google OAuth
    };
  }

  /**
   * Sanitiza y valida nombres para evitar valores inválidos
   * @param name - Nombre a sanitizar
   * @returns Nombre sanitizado o undefined si está vacío
   */
  private sanitizeName(name: string | undefined): string | undefined {
    if (!name || typeof name !== 'string') {
      return undefined;
    }
    
    const sanitized = name.trim();
    return sanitized.length > 0 ? sanitized : undefined;
  }

}
