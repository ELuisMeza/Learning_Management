import { Module } from '@nestjs/common';
import { StadisticsService } from './stadistics.service';
import { StadisticsController } from './stadistics.controller';
import { ClassesModule } from 'src/modules/classes/classes.module';
import { CareersModule } from 'src/modules/careers/careers.module';
import { UsersModule } from 'src/modules/users/users.module';
import { TeachersModule } from 'src/modules/teachers/teachers.module';

@Module({
  imports: [ClassesModule, CareersModule, UsersModule, TeachersModule],
  controllers: [StadisticsController],
  providers: [StadisticsService],
})
export class StadisticsModule {}
