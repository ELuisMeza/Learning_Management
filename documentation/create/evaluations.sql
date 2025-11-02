CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    evaluation_mode evaluation_modes default 'teacher',
    evaluation_type_id UUID NOT NULL REFERENCES evaluation_types(id),
    rubric_id UUID DEFAULT NULL REFERENCES rubrics(id) ON DELETE SET NULL,
    max_score DECIMAL(5,2) DEFAULT 100,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status global_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
