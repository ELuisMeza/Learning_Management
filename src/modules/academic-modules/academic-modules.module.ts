import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicModulesService } from './academic-modules.service';
import { AcademicModulesController } from './academic-modules.controller';
import { AcademicModule } from './academic-modules.entity';
import { AcademicCyclesModule } from '../academic-cycles/academic-cycles.module';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicModule]), AcademicCyclesModule],
  providers: [AcademicModulesService],
  controllers: [AcademicModulesController],
  exports: [AcademicModulesService],
})
export class AcademicModulesModule {}
