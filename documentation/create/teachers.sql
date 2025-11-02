CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialty VARCHAR(100),
  academic_degree VARCHAR(100),
  experience_years INT DEFAULT 0,
  bio TEXT,
  cv_url VARCHAR(255),
  teaching_modes teaching_modes default 'semipresencial',
  status global_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
