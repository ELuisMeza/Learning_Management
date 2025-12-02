import { BadRequestException, Injectable, Inject, forwardRef, NotFoundException, ConflictException } from '@nestjs/common';
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

@Injectable()
export class UsersService {
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
        appellative: createUserDto.name + ' ' + createUserDto.lastNameFather || '',
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
        appellative: user.teacher.appellative || '',
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

  async findGoogleUser(googleProfile: any): Promise<User> {
    const { email } = googleProfile;
    
    // Buscar si el usuario ya existe por email
    let user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    return user;
  }

  async getStadisticsStudents() {
    const totalActiveStudents = await this.userRepository.count({
      where: { role: { name: 'Estudiante' }, status: GlobalStatus.ACTIVE }
    });

    return {
      totalActiveStudents,
    };
  }

}
