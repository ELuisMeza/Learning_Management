CREATE TYPE global_status AS ENUM ('active', 'inactive');

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

CREATE TYPE teaching_modes AS ENUM ('in_person', 'online', 'hybrid');

CREATE TYPE enrollment_status AS ENUM ('in_course', 'completed', 'withdrawn');

CREATE TYPE evaluation_modes  AS ENUM ('teacher', 'self', 'peer');