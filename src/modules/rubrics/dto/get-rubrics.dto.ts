export interface RubricRawRow {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  user_creator_id: string;
  user_creator_name: string;
  user_creator_email: string;
  criterion_id: string | null;
  criterion_name: string | null;
  criterion_description: string | null;
  criterion_weight: number | null;
  level_id: string | null;
  level_name: string | null;
  level_description: string | null;
  level_score: number | null;
}

// Tipos para la respuesta transformada
export interface UserCreator {
  id: string;
  name: string;
  email: string;
}

export interface Level {
  id: string;
  name: string;
  description: string | null;
  score: number;
}

export interface Criterion {
  id: string;
  name: string;
  description: string | null;
  weight: number;
  levels: Level[];
}

export interface TransformedRubric {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  user_creator: UserCreator;
  criteria: Criterion[];
}