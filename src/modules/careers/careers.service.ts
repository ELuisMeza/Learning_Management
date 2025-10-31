import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './careers.entity';
import { CreateCareerDto } from './dto/create-career.dto';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { UpdateCareerDto } from './dto/update-career.dto';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
  ) {}

  async create(createCareerDto: CreateCareerDto): Promise<Career> {
    const career = this.careerRepository.create(createCareerDto);
    return await this.careerRepository.save(career);
  }

  async findAll(): Promise<Career[]> {
    return await this.careerRepository.find({ where: { status: GlobalStatus.ACTIVE } });
  }

  async update(id: string, updateCareerDto: UpdateCareerDto): Promise<Career> {
    const career = await this.getById(id);
    try {
      Object.assign(career, updateCareerDto);
      return await this.careerRepository.save(career);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getById(id: string): Promise<Career> {
    const career = await this.careerRepository.findOne({ where: { id, status: GlobalStatus.ACTIVE } });
    if (!career) {
      throw new NotFoundException(`Career with ID ${id} not found`);
    }
    return career;
  }

}
