CREATE TABLE rubric_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    criterion_id UUID NOT NULL REFERENCES rubric_criteria(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,       -- Nombre del nivel (ej. "Excelente", "Bueno", "Regular")
    description TEXT,                 -- Detalle del nivel
    score DECIMAL(5,2) NOT NULL,     -- Puntaje que otorga este nivel
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);