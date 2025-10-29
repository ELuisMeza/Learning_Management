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

  @Column({ type: 'varchar', default: 'activo' })
  status: string;

  @Column({ name: 'teacher_id', type: 'uuid', nullable: true })
  teacherId: string;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'jsonb', default: {} })
  schedule: Record<string, any>;

  @Column({ name: 'max_students', type: 'int', default: 1 })
  maxStudents: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
