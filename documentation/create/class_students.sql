CREATE TABLE class_students (
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT NOW(),
    final_note DECIMAL(5,2) DEFAULT NULL,
    status enrollment_status default 'in_course',
    updated_at TIMESTAMP DEFAULT NOW(),
    user_modified UUID REFERENCES users(id) ON DELETE SET NULL,
    PRIMARY KEY (class_id, student_id)
);