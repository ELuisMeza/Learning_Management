CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES academic_modules(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  credits INT DEFAULT 0,
  status global_status DEFAULT 'activo',
  teacher_id UUID REFERENCES teachers(id),
  schedule JSONB DEFAULT '{}',
  max_students INT default 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);