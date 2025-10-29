CREATE TABLE rubric_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rubric_id UUID NOT NULL REFERENCES rubrics(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,             -- Nombre del criterio
    description TEXT,                       -- Descripción del criterio
    weight DECIMAL(5,2) DEFAULT 1.0,       -- Ponderación dentro de la rúbrica
    order_number INT DEFAULT 1,             -- Orden de visualización del criterio
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
