import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, userCreatorId: string): Promise<User> {

    const newUser = new User();
    newUser.name = createUserDto.name;
    newUser.lastNameFather = createUserDto.lastNameFather;
    newUser.lastNameMother = createUserDto.lastNameMother;
    newUser.documentType = createUserDto.documentType;
    newUser.documentNumber = createUserDto.documentNumber;
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.gender = createUserDto.gender;
    newUser.birthdate = DateTime.fromISO(createUserDto.birthdate).toJSDate();
    newUser.phone = createUserDto.phone;
    newUser.roleId = createUserDto.roleId;
    newUser.createdBy = userCreatorId;
    newUser.createdAt = DateTime.now().toJSDate();
    newUser.updatedAt = DateTime.now().toJSDate();
    newUser.status = GlobalStatus.ACTIVE;

    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['role'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'teacher'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
