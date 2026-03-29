import { Module } from '@nestjs/common';
import { StadisticsService } from './stadistics.service';
import { StadisticsController } from './stadistics.controller';
import { ClassesModule } from '../classes/classes.module';
import { CareersModule } from '../careers/careers.module';
import { UsersModule } from '../users/users.module';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [ClassesModule, CareersModule, UsersModule, TeachersModule],
  controllers: [StadisticsController],
  providers: [StadisticsService],
})
export class StadisticsModule {}
