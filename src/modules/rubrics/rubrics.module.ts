import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricsService } from './rubrics.service';
import { RubricsController } from './rubrics.controller';
import { Rubric } from './rubrics.entity';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rubric]), TeachersModule, UsersModule],
  providers: [RubricsService],
  controllers: [RubricsController],
  exports: [RubricsService],
})
export class RubricsModule {}
