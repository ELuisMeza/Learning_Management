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
  teacher_id UUID unique references teachers(id), -- relación 1:1 con teachers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);