	CREATE TABLE roles (
	  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	  name VARCHAR(50) NOT NULL UNIQUE,
	  status global_status NOT NULL DEFAULT 'activo',
	  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);
	