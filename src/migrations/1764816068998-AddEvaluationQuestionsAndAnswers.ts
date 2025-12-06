import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEvaluationQuestionsAndAnswers1764816068998 implements MigrationInterface {
  name = 'AddEvaluationQuestionsAndAnswers1764816068998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Eliminar teacher_id de rubrics si existe (la entidad no lo tiene)
    const rubricsTable = await queryRunner.getTable('rubrics');
    if (rubricsTable) {
      const teacherIdColumn = rubricsTable.findColumnByName('teacher_id');
      if (teacherIdColumn) {
        // Eliminar la columna teacher_id si existe
        await queryRunner.query(`
          ALTER TABLE rubrics 
          DROP COLUMN IF EXISTS teacher_id;
        `);
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

    // Revertir cambios en rubrics (agregar teacher_id nullable si se eliminó)
    const rubricsTable = await queryRunner.getTable('rubrics');
    if (rubricsTable) {
      const teacherIdColumn = rubricsTable.findColumnByName('teacher_id');
      if (!teacherIdColumn) {
        await queryRunner.query(`
          ALTER TABLE rubrics 
          ADD COLUMN teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL;
        `);
      }
    }
  }
}

