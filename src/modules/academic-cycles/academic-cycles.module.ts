import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicCyclesService } from './academic-cycles.service';
import { AcademicCyclesController } from './academic-cycles.controller';
import { AcademicCycle } from './academic-cycles.entity';
import { CareersModule } from '../careers/careers.module';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicCycle]), CareersModule],
  providers: [AcademicCyclesService],
  controllers: [AcademicCyclesController],
  exports: [AcademicCyclesService],
})
export class AcademicCyclesModule {}
