import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassStudentsService } from './class-students.service';
import { ClassStudentsController } from './class-students.controller';
import { ClassStudent } from './class-students.entity';
import { ClassesModule } from '../classes/classes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClassStudent]), ClassesModule, UsersModule],
  providers: [ClassStudentsService],
  controllers: [ClassStudentsController],
  exports: [ClassStudentsService],
})
export class ClassStudentsModule {}
