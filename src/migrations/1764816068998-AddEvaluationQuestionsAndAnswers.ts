import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEvaluationQuestionsAndAnswers1764816068998 implements MigrationInterface {
  name = 'AddEvaluationQuestionsAndAnswers1764816068998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Corregir columna user_modified en class_students
    // La migración original tiene user_modified_id pero la entidad usa user_modified
    const classStudentsTable = await queryRunner.getTable('class_students');
    if (classStudentsTable) {
      const userModifiedIdColumn = classStudentsTable.findColumnByName('user_modified_id');
      const userModifiedColumn = classStudentsTable.findColumnByName('user_modified');
      
      if (userModifiedIdColumn && !userModifiedColumn) {
        await queryRunner.query(`
          ALTER TABLE class_students 
          RENAME COLUMN user_modified_id TO user_modified;
        `);
      }
    }

    // 2. Corregir teacher_id en rubrics para que sea NOT NULL (según la entidad)
    // Nota: Si ya hay datos con teacher_id NULL, esto podría fallar
    // En ese caso, primero actualiza los registros NULL o haz la columna nullable en la entidad
    const rubricsTable = await queryRunner.getTable('rubrics');
    if (rubricsTable) {
      const teacherIdColumn = rubricsTable.findColumnByName('teacher_id');
      if (teacherIdColumn && teacherIdColumn.isNullable) {
        // Verificar si hay registros con teacher_id NULL
        const result = await queryRunner.query(`
          SELECT COUNT(*)::int as count 
          FROM rubrics 
          WHERE teacher_id IS NULL;
        `);
        
        const count = typeof result[0]?.count === 'number' 
          ? result[0].count 
          : parseInt(result[0]?.count || '0', 10);
        
        if (count === 0) {
          await queryRunner.query(`
            ALTER TABLE rubrics 
            ALTER COLUMN teacher_id SET NOT NULL;
          `);
        }
        // Si hay registros NULL, no se modifica la columna para evitar errores
      }
    }

    // 3. Crear tabla evaluations_questions
    await queryRunner.query(`
      CREATE TABLE evaluations_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
        label TEXT NOT NULL,
        order_index INT DEFAULT 0 NOT NULL,
        score INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 4. Crear tabla evaluations_question_options
    await queryRunner.query(`
      CREATE TABLE evaluations_question_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID NOT NULL REFERENCES evaluations_questions(id) ON DELETE CASCADE,
        label TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT false NOT NULL,
        order_index INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 5. Crear tabla evaluation_answers
    await queryRunner.query(`
      CREATE TABLE evaluation_answers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES evaluations_questions(id) ON DELETE CASCADE,
        option_id UUID NOT NULL REFERENCES evaluations_question_options(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // 6. Crear índices para mejorar el rendimiento
    await queryRunner.query(`
      CREATE INDEX idx_evaluations_questions_evaluation_id 
      ON evaluations_questions (evaluation_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_evaluations_question_options_question_id 
      ON evaluations_question_options (question_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_evaluation_answers_user_id 
      ON evaluation_answers (user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_evaluation_answers_question_id 
      ON evaluation_answers (question_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX IF EXISTS idx_evaluation_answers_question_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_evaluation_answers_user_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_evaluations_question_options_question_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_evaluations_questions_evaluation_id`);

    // Eliminar tablas en orden inverso
    await queryRunner.query(`DROP TABLE IF EXISTS evaluation_answers`);
    await queryRunner.query(`DROP TABLE IF EXISTS evaluations_question_options`);
    await queryRunner.query(`DROP TABLE IF EXISTS evaluations_questions`);

    // Revertir cambios en rubrics
    const rubricsTable = await queryRunner.getTable('rubrics');
    if (rubricsTable) {
      const teacherIdColumn = rubricsTable.findColumnByName('teacher_id');
      if (teacherIdColumn && !teacherIdColumn.isNullable) {
        await queryRunner.query(`
          ALTER TABLE rubrics 
          ALTER COLUMN teacher_id DROP NOT NULL;
        `);
      }
    }

    // Revertir cambios en class_students
    const classStudentsTable = await queryRunner.getTable('class_students');
    if (classStudentsTable) {
      const userModifiedColumn = classStudentsTable.findColumnByName('user_modified');
      const userModifiedIdColumn = classStudentsTable.findColumnByName('user_modified_id');
      
      if (userModifiedColumn && !userModifiedIdColumn) {
        await queryRunner.query(`
          ALTER TABLE class_students 
          RENAME COLUMN user_modified TO user_modified_id;
        `);
      }
    }
  }
}

