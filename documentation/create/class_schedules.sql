CREATE TABLE class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  day_of_week day_of_week_enum NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(50), 
  status global_status DEFAULT 'active' NOT NULL,
  type_teaching teaching_modes DEFAULT 'in_person' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT chk_time_valid CHECK (start_time < end_time)
);

CREATE INDEX idx_class_schedules_day_time
ON class_schedules (day_of_week, start_time, end_time);


