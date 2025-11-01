import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Class } from '../classes/classes.entity';
import { IsEnum } from 'class-validator';
import { DayOfWeek } from 'src/globals/enums/day-of-week.enum';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';

@Entity('class_schedules')
export class ClassSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id', type: 'uuid' })
  classId: string;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ name: 'day_of_week', type: 'enum', enum: DayOfWeek, default: DayOfWeek.MONDAY })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string; 

  @Column({ name: 'room', type: 'varchar', length: 50, nullable: true })
  room: string;

  @Column({ name: 'type_teaching', type: 'enum', enum: TeachingModes, default: TeachingModes.IN_PERSON })
  @IsEnum(TeachingModes)
  typeTeaching: TeachingModes;

  @Column({ type: 'enum', enum: GlobalStatus, default: GlobalStatus.ACTIVE })
  @IsEnum(GlobalStatus)
  status: GlobalStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
