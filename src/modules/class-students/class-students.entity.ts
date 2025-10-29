import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from '../classes/classes.entity';
import { User } from '../users/users.entity';

@Entity('class_students')
export class ClassStudent {
  @PrimaryColumn({ name: 'class_id', type: 'uuid' })
  classId: string;

  @PrimaryColumn({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'enrollment_date', type: 'timestamp', default: () => 'NOW()' })
  enrollmentDate: Date;

  @Column({ name: 'final_note', type: 'decimal', precision: 5, scale: 2, nullable: true })
  finalNote: number;

  @Column({ type: 'varchar', default: 'in_course' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
