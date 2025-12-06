import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationResult } from './evaluation-results.entity';
import { RubricCriterion } from '../rubric-criteria/rubric-criteria.entity';
import { RubricLevel } from '../rubric-levels/rubric-levels.entity';

@Injectable()
export class EvaluationResultsService {
  constructor(
    @InjectRepository(EvaluationResult)
    private readonly evaluationResultRepository: Repository<EvaluationResult>,
    @InjectRepository(RubricCriterion)
    private readonly rubricCriterionRepository: Repository<RubricCriterion>,
    @InjectRepository(RubricLevel)
    private readonly rubricLevelRepository: Repository<RubricLevel>,
  ) {}

  /**
   * Guardar resultado de evaluación
   */
  async saveResult(
    evaluationId: string,
    studentId: string,
    score: number,
    metadata?: any,
  ): Promise<EvaluationResult> {
    // Verificar si ya existe un resultado para esta evaluación y estudiante
    let result = await this.evaluationResultRepository.findOne({
      where: {
        evaluationId,
        studentId,
      },
    });

    if (result) {
      // Actualizar resultado existente
      result.score = score;
      result.evaluatedAt = new Date();
      if (metadata) {
        result.feedback = JSON.stringify(metadata);
      }
    } else {
      // Crear nuevo resultado
      result = this.evaluationResultRepository.create({
        evaluationId,
        studentId,
        score,
        evaluatedAt: new Date(),
        feedback: metadata ? JSON.stringify(metadata) : undefined,
      });
    }

    return await this.evaluationResultRepository.save(result);
  }

  /**
   * Obtener resultados de una evaluación
   */
  async getResultsByEvaluationId(evaluationId: string): Promise<any[]> {
    const results = await this.evaluationResultRepository.find({
      where: { evaluationId },
      relations: ['student'],
      order: { evaluatedAt: 'DESC' },
    });

    // Transformar los resultados para que coincidan con el formato esperado por el frontend
    const transformedResults = await Promise.all(results.map(async (result) => {
      // Parsear el feedback (metadata) si existe
      let metadata: any = {};
      if (result.feedback) {
        try {
          metadata = JSON.parse(result.feedback);
        } catch (e) {
          // Si no es JSON válido, usar el texto como está
          metadata = { comments: result.feedback };
        }
      }

      // Enriquecer los scores con los datos completos de criterios y niveles
      const enrichedScores = await Promise.all((metadata.scores || []).map(async (score: any) => {
        let criterion: RubricCriterion | null = null;
        let level: RubricLevel | null = null;

        // Obtener el criterio completo si existe criteriaId
        if (score.criteriaId) {
          try {
            criterion = await this.rubricCriterionRepository.findOne({
              where: { id: score.criteriaId },
            });
          } catch (error) {
            console.error(`Error al obtener criterio ${score.criteriaId}:`, error);
          }
        }

        // Obtener el nivel completo si existe levelId
        if (score.levelId) {
          try {
            level = await this.rubricLevelRepository.findOne({
              where: { id: score.levelId },
            });
          } catch (error) {
            console.error(`Error al obtener nivel ${score.levelId}:`, error);
          }
        }

        return {
          ...score,
          criteria: criterion ? {
            id: criterion.id,
            name: criterion.name,
            description: criterion.description,
            weight: criterion.weight,
          } : null,
          level: level ? {
            id: level.id,
            name: level.name,
            description: level.description,
            score: level.score,
          } : null,
        };
      }));

      return {
        id: `${result.evaluationId}-${result.studentId}`, // ID compuesto
        evaluationId: result.evaluationId,
        evaluatorId: metadata.evaluatorId || result.studentId, // Quien evalúa
        evaluatedId: result.studentId, // Quien es evaluado
        totalScore: parseFloat(result.score?.toString() || '0'),
        scores: enrichedScores, // Scores enriquecidos con criterios y niveles
        comments: metadata.comments || null,
        submittedAt: result.evaluatedAt?.toISOString() || result.createdAt.toISOString(),
        student: result.student, // Para compatibilidad
      };
    }));

    return transformedResults;
  }

  /**
   * Obtener resultado de un estudiante en una evaluación
   */
  async getResultByStudentAndEvaluation(
    evaluationId: string,
    studentId: string,
  ): Promise<EvaluationResult | null> {
    return await this.evaluationResultRepository.findOne({
      where: {
        evaluationId,
        studentId,
      },
      relations: ['student', 'evaluation'],
    });
  }
}
