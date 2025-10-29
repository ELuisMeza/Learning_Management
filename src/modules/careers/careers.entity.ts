import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'degree_title', type: 'varchar', length: 150, nullable: true })
  degreeTitle: string;

  @Column({ type: 'varchar' })
  modality: string;

  @Column({ name: 'duration_years', type: 'int' })
  durationYears: number;

  @Column({ name: 'total_credits', type: 'int' })
  totalCredits: number;

  @Column({ type: 'varchar', default: 'activo' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
