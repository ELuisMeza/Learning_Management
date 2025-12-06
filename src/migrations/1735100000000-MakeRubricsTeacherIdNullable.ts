import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeRubricsTeacherIdNullable1735100000000 implements MigrationInterface {
  name = 'MakeRubricsTeacherIdNullable1735100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar teacher_id de rubrics si existe (la entidad actual no lo tiene)
    // Esta migración se mantiene para compatibilidad con bases de datos que ya tenían teacher_id
    const rubricsTable = await queryRunner.getTable('rubrics');
    if (rubricsTable) {
      const teacherIdColumn = rubricsTable.findColumnByName('teacher_id');
      if (teacherIdColumn) {
        await queryRunner.query(`
          ALTER TABLE rubrics 
          DROP COLUMN IF EXISTS teacher_id;
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: agregar teacher_id nullable nuevamente (solo si no existe)
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

