import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ClassStudentsService } from './class-students.service';
import { ClassStudentsController } from './class-students.controller';
import { ClassStudent } from './class-students.entity';
import { User } from '../users/users.entity';
import { ClassesModule } from '../classes/classes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassStudent, User]), 
    forwardRef(() => ClassesModule), 
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret_change_me',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [ClassStudentsService],
  controllers: [ClassStudentsController],
  exports: [ClassStudentsService],
})
export class ClassStudentsModule {}
