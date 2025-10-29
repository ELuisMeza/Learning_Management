import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  specialty: string;

  @Column({ name: 'academic_degree', type: 'varchar', length: 100, nullable: true })
  academicDegree: string;

  @Column({ name: 'experience_years', type: 'int', default: 0 })
  experienceYears: number;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'cv_url', type: 'varchar', length: 255, nullable: true })
  cvUrl: string;

  @Column({ name: 'teaching_modes', type: 'varchar', default: 'semipresencial' })
  teachingModes: string;

  @Column({ type: 'varchar', default: 'activo' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
