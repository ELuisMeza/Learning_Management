import 'reflect-metadata';
import dataSource from '../config/typeorm-datasource';

/**
 * Seed principal que ejecuta todos los seeds necesarios
 * Ejecuta: npm run seed
 */
async function run() {
  console.log('🌱 Iniciando proceso de seeds...\n');
  
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // 1. Seed de roles
    await seedRoles(queryRunner);
    
    // 2. Seed de usuario administrador
    await seedAdminUser(queryRunner);
    
    // 3. Seed de tipos de evaluación
    await seedEvaluationTypes(queryRunner);
    
    await queryRunner.commitTransaction();
    console.log('\n✅ Todos los seeds se ejecutaron correctamente');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('\n❌ Error ejecutando seeds:', err);
    throw err;
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

/**
 * Inserta los roles base del sistema
 */
async function seedRoles(queryRunner: any): Promise<void> {
  console.log('📝 Insertando roles...');
  
  const roles = ['Administrador', 'Docente', 'Estudiante'];
  let insertedCount = 0;
  
  for (const roleName of roles) {
    const result = await queryRunner.query(
      `INSERT INTO roles (name, status) VALUES ($1, 'active') ON CONFLICT (name) DO NOTHING RETURNING id`,
      [roleName],
    );
    
    if (result && result.length > 0) {
      insertedCount++;
      console.log(`  ✓ Rol "${roleName}" insertado`);
    } else {
      console.log(`  ⊘ Rol "${roleName}" ya existe`);
    }
  }
  
  console.log(`  ✅ Roles procesados: ${insertedCount} nuevos, ${roles.length - insertedCount} existentes\n`);
}

/**
 * Inserta el usuario administrador por defecto
 */
async function seedAdminUser(queryRunner: any): Promise<void> {
  console.log('👤 Insertando usuario administrador...');
  
  // Obtener el rol de administrador
  const [adminRole] = await queryRunner.query(
    `SELECT id FROM roles WHERE name = $1 LIMIT 1`,
    ['Administrador'],
  );

  if (!adminRole?.id) {
    throw new Error('No se encontró el rol Administrador. Asegúrate de que los roles se hayan insertado correctamente.');
  }

  // Verificar si el usuario admin ya existe
  const [existingUser] = await queryRunner.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    ['admin@example.com'],
  );

  if (existingUser?.id) {
    console.log('  ⊘ Usuario administrador ya existe');
    console.log('  ℹ️  Email: admin@example.com');
    console.log('  ℹ️  Password: admin123\n');
    return;
  }

  // Insertar usuario administrador
  const result = await queryRunner.query(
    `INSERT INTO users (
      name, last_name_father, last_name_mother, document_type, document_number,
      email, password, status, gender, birthdate, phone, role_id, created_by
    ) VALUES (
      'admin', 'del', 'sistema', 'DNI', '12365478',
      'admin@example.com',
      '$2b$10$xy1pWdczt0uQuYe1MdLdmutm3UErg5OkfLglrCay6ewYHhdunj4wW',
      'active', 'male', '1990-05-20', '+51 987654321', $1, NULL
    ) ON CONFLICT (email) DO NOTHING RETURNING id`,
    [adminRole.id],
  );

  if (result && result.length > 0) {
    console.log('  ✓ Usuario administrador insertado');
    console.log('  ℹ️  Email: admin@example.com');
    console.log('  ℹ️  Password: admin123\n');
  } else {
    console.log('  ⊘ Usuario administrador ya existe\n');
  }
}

/**
 * Inserta los tipos de evaluación base
 */
async function seedEvaluationTypes(queryRunner: any): Promise<void> {
  console.log('📋 Insertando tipos de evaluación...');
  
  const evaluationTypes = ['Exposición', 'Examen'];
  let insertedCount = 0;
  
  for (const typeName of evaluationTypes) {
    const result = await queryRunner.query(
      `INSERT INTO evaluation_types (name, description, created_at, updated_at) 
       VALUES ($1, '', NOW(), NOW()) 
       ON CONFLICT (name) DO NOTHING RETURNING id`,
      [typeName],
    );
    
    if (result && result.length > 0) {
      insertedCount++;
      console.log(`  ✓ Tipo "${typeName}" insertado`);
    } else {
      console.log(`  ⊘ Tipo "${typeName}" ya existe`);
    }
  }
  
  console.log(`  ✅ Tipos de evaluación procesados: ${insertedCount} nuevos, ${evaluationTypes.length - insertedCount} existentes\n`);
}

// Ejecutar seeds
run().catch((err) => {
  console.error('\n❌ Error fatal en seeds:', err);
  process.exit(1);
});


