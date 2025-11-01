import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AcademicCycle } from '../academic-cycles/academic-cycles.entity';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { IsEnum } from 'class-validator';

@Entity('academic_modules')
export class AcademicModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cycle_id', type: 'uuid' })
  cycleId: string;

  @ManyToOne(() => AcademicCycle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cycle_id' })
  cycle: AcademicCycle;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'order_number', type: 'int', default: 1 })
  orderNumber: number;

  @Column({ type: 'enum', enum: GlobalStatus, default: GlobalStatus.ACTIVE })
  @IsEnum(GlobalStatus)
  status: GlobalStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
