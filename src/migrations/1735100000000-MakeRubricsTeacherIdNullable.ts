import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeRubricsTeacherIdNullable1735100000000 implements MigrationInterface {
  name = 'MakeRubricsTeacherIdNullable1735100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hacer teacher_id nullable en la tabla rubrics
    // Esto permite que usuarios que no son teachers puedan crear rúbricas
    await queryRunner.query(`
      ALTER TABLE rubrics 
      ALTER COLUMN teacher_id DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: hacer teacher_id NOT NULL nuevamente
    // Primero actualizar cualquier NULL a un valor por defecto si es necesario
    await queryRunner.query(`
      ALTER TABLE rubrics 
      ALTER COLUMN teacher_id SET NOT NULL;
    `);
  }
}

