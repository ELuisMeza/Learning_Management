import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertEvaluationTypes1735000000000 implements MigrationInterface {
  name = 'InsertEvaluationTypes1735000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si ya existe el tipo "Examen"
    const examenExists = await queryRunner.query(`
      SELECT COUNT(*)::int as count 
      FROM evaluation_types 
      WHERE LOWER(name) = 'examen';
    `);

    const count = typeof examenExists[0]?.count === 'number' 
      ? examenExists[0].count 
      : parseInt(examenExists[0]?.count || '0', 10);

    // Insertar "Examen" si no existe (OBLIGATORIO)
    if (count === 0) {
      await queryRunner.query(`
        INSERT INTO evaluation_types (id, name, description, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          'Examen',
          'Evaluación tipo examen con preguntas de opción múltiple y calificación automática',
          NOW(),
          NOW()
        );
      `);
    }

    // Insertar otros tipos comunes de evaluación si no existen
    const otherTypes = [
      {
        name: 'Tarea',
        description: 'Evaluación tipo tarea o trabajo práctico',
      },
      {
        name: 'Proyecto',
        description: 'Evaluación tipo proyecto grupal o individual',
      },
      {
        name: 'Práctica',
        description: 'Evaluación tipo práctica o laboratorio',
      },
      {
        name: 'Participación',
        description: 'Evaluación de participación en clase',
      },
    ];

    for (const type of otherTypes) {
      const typeExists = await queryRunner.query(`
        SELECT COUNT(*)::int as count 
        FROM evaluation_types 
        WHERE LOWER(name) = LOWER('${type.name.replace(/'/g, "''")}');
      `);

      const typeCount = typeof typeExists[0]?.count === 'number' 
        ? typeExists[0].count 
        : parseInt(typeExists[0]?.count || '0', 10);

      if (typeCount === 0) {
        await queryRunner.query(`
          INSERT INTO evaluation_types (id, name, description, created_at, updated_at)
          VALUES (
            gen_random_uuid(),
            '${type.name.replace(/'/g, "''")}',
            '${type.description.replace(/'/g, "''")}',
            NOW(),
            NOW()
          );
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar los tipos de evaluación insertados
    await queryRunner.query(`
      DELETE FROM evaluation_types 
      WHERE LOWER(name) IN ('examen', 'tarea', 'proyecto', 'práctica', 'participación');
    `);
  }
}

