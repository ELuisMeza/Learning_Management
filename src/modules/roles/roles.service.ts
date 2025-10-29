import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { status: GlobalStatus.ACTIVE },
    });
  } 

  async getById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id, status: GlobalStatus.ACTIVE } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
