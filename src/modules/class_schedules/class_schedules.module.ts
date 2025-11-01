import { Module } from '@nestjs/common';
import { ClassSchedulesService } from './class_schedules.service';
import { ClassSchedulesController } from './class_schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSchedule } from './class_schedules.entity';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClassSchedule]), ClassesModule],
  providers: [ClassSchedulesService],
  controllers: [ClassSchedulesController],
  exports: [ClassSchedulesService],
})
export class ClassSchedulesModule {}
