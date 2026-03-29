import { Injectable } from '@nestjs/common';
import { CareersService } from '../careers/careers.service';
import { ClassesService } from '../classes/classes.service';
import { TeachersService } from '../teachers/teachers.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class StadisticsService {

  constructor(
    private readonly classesService: ClassesService,
    private readonly careersService: CareersService,
    private readonly usersService: UsersService,
    private readonly teachersService: TeachersService,
  ) {}

  async getStadistics() {
    
    const classes = await this.classesService.getStadistics();
    const careers = await this.careersService.getStadistics();
    const students = await this.usersService.getStadisticsStudents();
    const teachers = await this.teachersService.getStadisticsTeachers();
    return { classes, careers, students, teachers };

  }

}
