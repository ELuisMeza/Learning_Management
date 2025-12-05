import { Level, RubricRawRow, TransformedRubric } from "../dto/get-rubrics.dto";

export const transformResponse = (rubricRows: RubricRawRow[]): TransformedRubric[] => {
  if (!rubricRows || rubricRows.length === 0) {
    return [];
  }

  // Agrupar por ID de rúbrica
  const rubricMap = new Map<string, TransformedRubric>();

  rubricRows.forEach((row: RubricRawRow) => {
    const rubricId = row.id;

    // Crear o obtener la rúbrica
    if (!rubricMap.has(rubricId)) {
      const rubric: TransformedRubric = {
        id: row.id,
        name: row.name,
        description: row.description,
        created_at: row.created_at,
        user_creator: {
          id: row.user_creator_id,
          name: row.user_creator_name,
          email: row.user_creator_email,
        },
        criteria: [],
      };
      rubricMap.set(rubricId, rubric);
    }

    const rubric = rubricMap.get(rubricId)!;

    // Agrupar por ID de criterio dentro de la rúbrica
    if (row.criterion_id) {
      let criterion = rubric.criteria.find((c) => c.id === row.criterion_id);

      if (!criterion) {
        criterion = {
          id: row.criterion_id,
          name: row.criterion_name!,
          description: row.criterion_description,
          weight: row.criterion_weight!,
          levels: [],
        };
        rubric.criteria.push(criterion);
      }

      // Agrupar por ID de nivel dentro del criterio
      if (row.level_id) {
        const levelExists = criterion.levels.some((l) => l.id === row.level_id);
        
        if (!levelExists) {
          const level: Level = {
            id: row.level_id,
            name: row.level_name!,
            description: row.level_description,
            score: row.level_score!,
          };
          criterion.levels.push(level);
        }
      }
    }
  });

  // Retornar todas las rúbricas como array
  return Array.from(rubricMap.values());
};