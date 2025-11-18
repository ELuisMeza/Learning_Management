import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './classes.entity';
import { AcademicModulesModule } from '../academic-modules/academic-modules.module';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';
import { ClassStudentsModule } from '../class-students/class-students.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    AcademicModulesModule,
    TeachersModule,
    forwardRef(() => UsersModule),
    forwardRef(() => ClassStudentsModule),
  ],
  providers: [ClassesService],
  controllers: [ClassesController],
  exports: [ClassesService],
})
export class ClassesModule {}
