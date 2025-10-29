import 'reflect-metadata';
import dataSource from '../config/typeorm-datasource';

async function run() {
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // Insert roles if not exist
    const roles = ['Administrador', 'Docente', 'Estudiante'];
    for (const roleName of roles) {
      await queryRunner.query(
        `INSERT INTO roles (name, status) VALUES ($1, 'active') ON CONFLICT (name) DO NOTHING`,
        [roleName],
      );
    }

    // Ensure admin user exists
    const [adminRole] = await queryRunner.query(
      `SELECT id FROM roles WHERE name = $1 LIMIT 1`,
      ['Administrador'],
    );

    if (adminRole?.id) {
      await queryRunner.query(
        `INSERT INTO users (
          name, last_name_father, last_name_mother, document_type, document_number,
          email, password, status, gender, birthdate, phone, role_id, created_by
        ) VALUES (
          'admin', 'del', 'sistema', 'DNI', '12365478',
          'admin@example.com',
          '$2b$10$xy1pWdczt0uQuYe1MdLdmutm3UErg5OkfLglrCay6ewYHhdunj4wW',
          'active', 'male', '1990-05-20', '+51 987654321', $1, NULL
        ) ON CONFLICT (email) DO NOTHING`,
        [adminRole.id],
      );
    }

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', err);
  process.exit(1);
});


