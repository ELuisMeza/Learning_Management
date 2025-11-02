import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/database.config';

// Modules imports
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { CareersModule } from './modules/careers/careers.module';
import { AcademicCyclesModule } from './modules/academic-cycles/academic-cycles.module';
import { AcademicModulesModule } from './modules/academic-modules/academic-modules.module';
import { ClassesModule } from './modules/classes/classes.module';
import { ClassStudentsModule } from './modules/class-students/class-students.module';
import { EvaluationTypesModule } from './modules/evaluation-types/evaluation-types.module';
import { RubricsModule } from './modules/rubrics/rubrics.module';
import { RubricCriteriaModule } from './modules/rubric-criteria/rubric-criteria.module';
import { RubricLevelsModule } from './modules/rubric-levels/rubric-levels.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { EvaluationResultsModule } from './modules/evaluation-results/evaluation-results.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClassSchedulesModule } from './modules/class_schedules/class_schedules.module';
import { EmailsModule } from './modules/emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    RolesModule,
    TeachersModule,
    CareersModule,
    AcademicCyclesModule,
    AcademicModulesModule,
    ClassesModule,
    ClassStudentsModule,
    EvaluationTypesModule,
    RubricsModule,
    RubricCriteriaModule,
    RubricLevelsModule,
    EvaluationsModule,
    EvaluationResultsModule,
    AuthModule,
    ClassSchedulesModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
