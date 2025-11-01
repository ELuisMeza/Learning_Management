import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { GlobalStatus } from 'src/globals/enums/global-status.enum';
import { IsEnum } from 'class-validator';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'enum', enum: GlobalStatus, default: GlobalStatus.ACTIVE })
  @IsEnum(GlobalStatus)
  status: GlobalStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;
}
