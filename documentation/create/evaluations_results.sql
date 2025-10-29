CREATE TABLE evaluation_results (
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score DECIMAL(5,2) DEFAULT NULL,  -- nota obtenida
    feedback TEXT,                     -- comentarios del docente o autoevaluación
    evaluated_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (evaluation_id, student_id)
);