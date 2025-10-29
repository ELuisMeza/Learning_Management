INSERT INTO users (
  name,
  last_name_father,
  last_name_mother,
  document_type,
  document_number,
  email,
  password,
  status,
  gender,
  birthdate,
  phone,
  role_id,
  created_by
) VALUES (
  'admin',
  'del',
  'sistema',
  'DNI',
  '12365478',
  'admin@example.com',
  '$2b$10$xy1pWdczt0uQuYe1MdLdmutm3UErg5OkfLglrCay6ewYHhdunj4wW', -- contraseña hasheada = admin123
  'active',
  'male',
  '1990-05-20',
  '+51 987654321',
  '9c756d02-0d56-41d7-8818-98f05ef07162',
  NULL
);