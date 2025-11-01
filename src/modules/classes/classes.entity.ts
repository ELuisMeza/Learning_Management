import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AcademicModule } from '../academic-modules/academic-modules.entity';
import { Teacher } from '../teachers/teachers.entity';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';
import { IsEnum } from 'class-validator';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'module_id', type: 'uuid' })
  moduleId: string;

  @ManyToOne(() => AcademicModule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: AcademicModule;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  credits: number;

  @Column({ type: 'enum', enum: GlobalStatus, default: GlobalStatus.ACTIVE })
  @IsEnum(GlobalStatus)
  status: GlobalStatus;

  @Column({ name: 'teacher_id', type: 'uuid', nullable: true })
  teacherId: string;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ name: 'type_teaching', type: 'enum', enum: TeachingModes, default: TeachingModes.IN_PERSON })
  @IsEnum(TeachingModes)
  typeTeaching: TeachingModes;

  @Column({ name: 'max_students', type: 'int', default: 1, nullable: false })
  maxStudents: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
