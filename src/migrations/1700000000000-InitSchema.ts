import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 0.- Enums y extensiones requeridas
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    await queryRunner.query(`CREATE TYPE global_status AS ENUM ('active', 'inactive')`);
    await queryRunner.query(`CREATE TYPE gender_type AS ENUM ('male', 'female', 'other')`);
    await queryRunner.query(`CREATE TYPE teaching_modes AS ENUM ('in_person', 'online', 'hybrid')`);
    await queryRunner.query(`CREATE TYPE enrollment_status AS ENUM ('in_course', 'completed', 'withdrawn')`);
    await queryRunner.query(`CREATE TYPE evaluation_modes AS ENUM ('teacher', 'self', 'peer')`);
    await queryRunner.query(`CREATE TYPE day_of_week_enum AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')`);

    // 1.- roles
    await queryRunner.query(`
      CREATE TABLE roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        status global_status NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 2.- teachers
    await queryRunner.query(`
      CREATE TABLE teachers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        specialty VARCHAR(100),
        academic_degree VARCHAR(100),
        experience_years INT DEFAULT 0,
        bio TEXT,
        cv_url VARCHAR(255),
        teaching_modes teaching_modes DEFAULT 'hybrid',
        status global_status DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 3.- users
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        last_name_father VARCHAR(100) NOT NULL,
        last_name_mother VARCHAR(100),
        document_type VARCHAR(20),
        document_number VARCHAR(20),
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255),
        status global_status DEFAULT 'active',
        gender gender_type,
        birthdate DATE,
        phone VARCHAR(20),
        role_id UUID NOT NULL REFERENCES roles(id),
        teacher_id UUID UNIQUE REFERENCES teachers(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by UUID REFERENCES users(id)
      )
    `);

    // 4.- careers
    await queryRunner.query(`
      CREATE TABLE careers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        degree_title VARCHAR(150),
        modality teaching_modes NOT NULL,
        duration_years INT CHECK (duration_years > 0),
        total_credits INT CHECK (total_credits >= 0),
        status global_status DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5.- academic_cycles
    await queryRunner.query(`
      CREATE TABLE academic_cycles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        order_number INT DEFAULT 1,
        credits_required INT DEFAULT 0,
        duration_weeks INT DEFAULT 16,
        status global_status DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 6.- academic_modules
    await queryRunner.query(`
      CREATE TABLE academic_modules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cycle_id UUID NOT NULL REFERENCES academic_cycles(id) ON DELETE CASCADE,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        order_number INT DEFAULT 1,
        status global_status DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 7.- classes
    await queryRunner.query(`
        CREATE TABLE classes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          module_id UUID NOT NULL REFERENCES academic_modules(id) ON DELETE CASCADE,
          code VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(150) NOT NULL,
          description TEXT,
          credits INT DEFAULT 0,
          status global_status DEFAULT 'active',
          teacher_id UUID REFERENCES teachers(id),
          type_teaching teaching_modes default 'in_person' not null,
          max_students INT default 1  not null,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
    `);

    // 8.- class_schedules
    await queryRunner.query(`
      CREATE TABLE class_schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        day_of_week day_of_week_enum NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,   
        room VARCHAR(50), 
        status global_status DEFAULT 'active' NOT NULL,
        type_teaching teaching_modes DEFAULT 'in_person' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT chk_time_valid CHECK (start_time < end_time)
      );

      CREATE INDEX idx_class_schedules_day_time
      ON class_schedules (day_of_week, start_time, end_time);
    `);

    // 9.- tabla intermedia class_students
    await queryRunner.query(`
      CREATE TABLE class_students (
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        enrollment_date TIMESTAMP DEFAULT NOW(),
        final_note DECIMAL(5,2) DEFAULT NULL,
        status enrollment_status DEFAULT 'in_course',
        updated_at TIMESTAMP DEFAULT NOW(),
        user_modified_id UUID REFERENCES users(id) ON DELETE SET NULL,
        PRIMARY KEY (class_id, student_id)
      )
    `);

    // 10.- evaluation_types
    await queryRunner.query(`
      CREATE TABLE evaluation_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 11.- rubrics
    await queryRunner.query(`
      CREATE TABLE rubrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        user_creator UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 12.- evaluations
    await queryRunner.query(`
      CREATE TABLE evaluations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        evaluation_mode evaluation_modes DEFAULT 'teacher',
        evaluation_type_id UUID NOT NULL REFERENCES evaluation_types(id),
        rubric_id UUID DEFAULT NULL REFERENCES rubrics(id) ON DELETE SET NULL,
        max_score DECIMAL(5,2) DEFAULT 100,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status global_status DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 13.- evaluation_results
    await queryRunner.query(`
      CREATE TABLE evaluation_results (
        evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        score DECIMAL(5,2) DEFAULT NULL,
        feedback TEXT,
        evaluated_at TIMESTAMP DEFAULT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (evaluation_id, student_id)
      )
    `);

    // 14.- rubric_criteria
    await queryRunner.query(`
      CREATE TABLE rubric_criteria (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rubric_id UUID NOT NULL REFERENCES rubrics(id) ON DELETE CASCADE,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        weight DECIMAL(5,2) DEFAULT 1.0,
        order_number INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 15.- rubric_levels
    await queryRunner.query(`
      CREATE TABLE rubric_levels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        criterion_id UUID NOT NULL REFERENCES rubric_criteria(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        score DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS rubric_levels`);
    await queryRunner.query(`DROP TABLE IF EXISTS rubric_criteria`);
    await queryRunner.query(`DROP TABLE IF EXISTS evaluation_results`);
    await queryRunner.query(`DROP TABLE IF EXISTS evaluations`);
    await queryRunner.query(`DROP TABLE IF EXISTS rubrics`);
    await queryRunner.query(`DROP TABLE IF EXISTS evaluation_types`);
    await queryRunner.query(`DROP TABLE IF EXISTS class_students`);
    await queryRunner.query(`DROP TABLE IF EXISTS classes`);
    await queryRunner.query(`DROP TABLE IF EXISTS academic_modules`);
    await queryRunner.query(`DROP TABLE IF EXISTS academic_cycles`);
    await queryRunner.query(`DROP TABLE IF EXISTS careers`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TABLE IF EXISTS teachers`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles`);

    // drop types
    await queryRunner.query(`DROP TYPE IF EXISTS evaluation_modes`);
    await queryRunner.query(`DROP TYPE IF EXISTS enrollment_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS teaching_modes`);
    await queryRunner.query(`DROP TYPE IF EXISTS gender_type`);
    await queryRunner.query(`DROP TYPE IF EXISTS global_status`);
  }
}


