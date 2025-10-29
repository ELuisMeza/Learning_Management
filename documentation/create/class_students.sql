CREATE TABLE class_students (
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT NOW(),
    final_note DECIMAL(5,2) DEFAULT NULL,
    status enrollment_status default 'in_course',
    PRIMARY KEY (class_id, student_id)
);