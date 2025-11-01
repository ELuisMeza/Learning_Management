import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Career } from '../careers/careers.entity';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { IsEnum } from 'class-validator';

@Entity('academic_cycles')
export class AcademicCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'career_id', type: 'uuid' })
  careerId: string;

  @ManyToOne(() => Career, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'career_id' })
  career: Career;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'order_number', type: 'int', default: 1 })
  orderNumber: number;

  @Column({ name: 'credits_required', type: 'int', default: 0 })
  creditsRequired: number;

  @Column({ name: 'duration_weeks', type: 'int', default: 16 })
  durationWeeks: number;

  @Column({ type: 'enum', enum: GlobalStatus, default: GlobalStatus.ACTIVE })
  @IsEnum(GlobalStatus)
  status: GlobalStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
