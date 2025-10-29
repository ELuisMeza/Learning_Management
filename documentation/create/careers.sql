CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    degree_title VARCHAR(150),
    modality teaching_modes NOT NULL,
    duration_years INT CHECK (duration_years > 0),
    total_credits INT CHECK (total_credits >= 0),
    status global_status DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);