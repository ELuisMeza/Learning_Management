import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubric } from './rubrics.entity';
import { CreateRubricDto } from './dto/create.dto';
import { UsersService } from '../users/users.service';
import { RubricLevelsService } from '../rubric-levels/rubric-levels.service';
import { RubricCriteriaService } from '../rubric-criteria/rubric-criteria.service';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';
import { transformResponse } from './utils/transform-response';
import { TransformedRubric } from './dto/get-rubrics.dto';

// Importación condicional de xlsx - se requiere instalar: npm install xlsx @types/xlsx
// eslint-disable-next-line @typescript-eslint/no-var-requires
let XLSX: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  XLSX = require('xlsx');
} catch (error) {
  // xlsx no está instalado, se manejará en el método createFromExcel
  XLSX = null;
}

@Injectable()
export class RubricsService {
  constructor(
    @InjectRepository(Rubric)
    private readonly rubricRepository: Repository<Rubric>,
    private readonly userService: UsersService,
    private readonly rubricLevelsService: RubricLevelsService,
    private readonly rubricCriteriaService: RubricCriteriaService,
  ) {}

  async create(createRubricDto: CreateRubricDto, userCreatorId: string): Promise<Rubric> {
    const user = await this.userService.getByIdAndActive(userCreatorId);

    try {
      // Obtener el teacher_id del usuario (si tiene un teacher asociado)
      const teacherId = user.teacher?.id || null;
      
      // Crear y guardar la rúbrica usando query SQL directa para incluir teacher_id
      // que no está en la entidad pero puede ser requerido en la BD
      console.log('=== CREANDO RÚBRICA ===');
      console.log('User ID:', user.id);
      console.log('Teacher ID:', teacherId);
      console.log('Name:', createRubricDto.name);
      
      // Usar query SQL directa para asegurar que los valores se inserten correctamente
      const insertResult = await this.rubricRepository.query(
        `INSERT INTO rubrics (name, description, user_creator, teacher_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id`,
        [
          createRubricDto.name,
          createRubricDto.description || null,
          user.id,
          teacherId,
        ]
      );
      
      const rubricId = insertResult[0].id;
      console.log('Rúbrica insertada con ID:', rubricId);
      
      // Verificar que se guardó correctamente consultando directamente
      const verifyQuery = await this.rubricRepository.query(
        'SELECT id, name, user_creator, teacher_id FROM rubrics WHERE id = $1',
        [rubricId]
      );
      console.log('Verificación directa en BD:', verifyQuery[0]);
      console.log('=== RÚBRICA CREADA ===');
      console.log('RubricId generado:', rubricId);
      console.log('UserCreatorId usado:', user.id);
      console.log('TeacherId usado:', teacherId);
      
      // Obtener la rúbrica guardada
      const savedRubric = await this.rubricRepository.findOne({
        where: { id: rubricId },
      });
      
      console.log('Rúbrica recuperada:', savedRubric ? {
        id: savedRubric.id,
        name: savedRubric.name,
        userCreatorId: savedRubric.userCreatorId,
      } : 'NO ENCONTRADA');
      
      if (!savedRubric) {
        throw new NotFoundException('No se pudo recuperar la rúbrica después de crearla');
      }
      
      console.log('========================');

      // Crear los criterios y sus niveles
      if (createRubricDto.criteria && createRubricDto.criteria.length > 0) {
        for (const criterionDto of createRubricDto.criteria) {
          const criterion = await this.rubricCriteriaService.create(criterionDto, savedRubric.id);

          // Crear los niveles del criterio
          if (criterionDto.levels && criterionDto.levels.length > 0) {
            for (const levelDto of criterionDto.levels) {
              await this.rubricLevelsService.create(levelDto, criterion.id);
            }
          }
        }
      }

      const rubricWithRelations = await this.rubricRepository.findOne({
        where: { id: savedRubric.id },
        relations: ['userCreator'],
      });

      if (!rubricWithRelations) {
        throw new NotFoundException('Rubrica no encontrada después de la creación');
      }

      return rubricWithRelations;
    } catch (error) {
      console.error('=== ERROR AL CREAR RÚBRICA ===');
      console.error('Error completo:', error);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      console.error('DTO recibido:', JSON.stringify(createRubricDto, null, 2));
      console.error('UserCreatorId:', userCreatorId);
      console.error('================================');
      throw new InternalServerErrorException(error.message || 'Error desconocido al crear la rúbrica');
    }
  }

  async getByUserCreator(
    userCreatorId: string,
    getRubricsDto: BasePayloadGetDto,
  ) {
    const { page = 1, limit = 10, search } = getRubricsDto;
    console.log('=== OBTENIENDO RÚBRICAS ===');
    console.log('UserCreatorId:', userCreatorId);
    console.log('Params:', getRubricsDto);
    
    const queryBuilder = this.rubricRepository
      .createQueryBuilder('rubric')
      .leftJoin('rubric.userCreator', 'userCreator')
      .where('rubric.userCreatorId = :userCreatorId', { userCreatorId });

    if (search) {
      queryBuilder.andWhere(
        '(rubric.name ILIKE :search OR rubric.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;

    const total = await queryBuilder.getCount();
    console.log('Total de rúbricas encontradas:', total);

    const { entities, raw } = await queryBuilder
      .orderBy('rubric.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    console.log('Entidades encontradas:', entities.length);
    console.log('Primera entidad:', entities[0] ? {
      id: entities[0].id,
      name: entities[0].name,
      userCreatorId: entities[0].userCreatorId,
    } : 'Ninguna');

    const data = entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      description: entity.description || '',
      createdat: entity.createdAt ? entity.createdAt.toISOString() : new Date().toISOString(),
      usercreatorid: entity.userCreatorId,
    }));

    console.log('Data formateada:', data.length, 'elementos');
    console.log('===========================');

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string): Promise<TransformedRubric> {
    const rubricRows = await this.rubricRepository.createQueryBuilder('r')
      .select([
        'r.id as id',
        'r.name as name',
        'r.description as description',
        'r.created_at as created_at',
        'u.id as user_creator_id',
        'u.name as user_creator_name',
        'u.email as user_creator_email',
        'rc.id as criterion_id',
        'rc.name as criterion_name',
        'rc.description as criterion_description',
        'rc.weight as criterion_weight',
        'rl.id as level_id',
        'rl.name as level_name',
        'rl.description as level_description',
        'rl.score as level_score',
      ])  
      .leftJoin('users', 'u', 'u.id = r.user_creator')
      .leftJoin('rubric_criteria', 'rc', 'rc.rubric_id = r.id')
      .leftJoin('rubric_levels', 'rl', 'rl.criterion_id = rc.id')
      .where('r.id = :id', { id })
      .getRawMany();

    const rubrics = transformResponse(rubricRows);

    if (!rubrics || rubrics.length === 0) {
      throw new NotFoundException(`Rubrica con ID ${id} no encontrada`);
    }
    return rubrics[0];
  }

  async createFromExcel(file: { buffer: Buffer; originalname: string }, userCreatorId: string): Promise<Rubric> {
    try {
      // Verificar que xlsx esté instalado
      if (!XLSX) {
        throw new BadRequestException(
          'La librería xlsx no está instalada. Por favor, ejecuta: npm install xlsx @types/xlsx'
        );
      }

      // Leer el archivo Excel
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      
      // Obtener la primera hoja
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new BadRequestException('El archivo Excel no contiene hojas');
      }

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];

      if (!data || data.length < 2) {
        throw new BadRequestException('El archivo Excel debe tener al menos una fila de encabezados y una fila de datos');
      }

      // Obtener nombre de la rúbrica del nombre del archivo (sin extensión)
      const rubricName = file.originalname.replace(/\.(xlsx|xls)$/i, '').trim() || 'Rúbrica desde Excel';
      
      // Parsear los datos del Excel
      // Formato esperado: Criterio | Descripción Criterio | Peso | Nivel | Descripción Nivel | Puntuación
      const headers = data[0].map((h: any) => String(h).toLowerCase().trim());
      
      // Buscar índices de columnas (flexible con diferentes nombres)
      const criterioIndex = headers.findIndex(h => 
        h.includes('criterio') && !h.includes('descripción')
      );
      const descCriterioIndex = headers.findIndex(h => 
        (h.includes('descripción') || h.includes('descripcion')) && h.includes('criterio')
      );
      const pesoIndex = headers.findIndex(h => h.includes('peso') || h.includes('weight'));
      const nivelIndex = headers.findIndex(h => 
        h.includes('nivel') && !h.includes('descripción') && !h.includes('descripcion')
      );
      const descNivelIndex = headers.findIndex(h => 
        (h.includes('descripción') || h.includes('descripcion')) && h.includes('nivel')
      );
      const puntuacionIndex = headers.findIndex(h => 
        h.includes('puntuación') || h.includes('puntuacion') || h.includes('score') || h.includes('puntos')
      );

      if (criterioIndex === -1 || nivelIndex === -1 || puntuacionIndex === -1) {
        throw new BadRequestException(
          'El archivo Excel debe tener las columnas: Criterio, Nivel y Puntuación. ' +
          'Columnas encontradas: ' + headers.join(', ')
        );
      }

      // Agrupar datos por criterio
      const criteriaMap = new Map<string, {
        name: string;
        description?: string;
        weight?: number;
        levels: Array<{ name: string; description?: string; score: number }>;
      }>();

      // Procesar filas de datos (empezar desde la fila 1, ya que 0 son los encabezados)
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const criterioName = String(row[criterioIndex] || '').trim();
        const nivelName = String(row[nivelIndex] || '').trim();
        const puntuacionStr = String(row[puntuacionIndex] || '').trim();

        if (!criterioName || !nivelName || !puntuacionStr) {
          continue; // Saltar filas incompletas
        }

        const puntuacion = parseFloat(puntuacionStr);
        if (isNaN(puntuacion) || puntuacion < 0) {
          throw new BadRequestException(
            `Fila ${i + 1}: La puntuación debe ser un número válido mayor o igual a 0`
          );
        }

        // Obtener o crear el criterio
        if (!criteriaMap.has(criterioName)) {
          const descCriterio = descCriterioIndex !== -1 ? String(row[descCriterioIndex] || '').trim() : undefined;
          const pesoStr = pesoIndex !== -1 ? String(row[pesoIndex] || '').trim() : undefined;
          const peso = pesoStr ? parseFloat(pesoStr) : undefined;

          criteriaMap.set(criterioName, {
            name: criterioName,
            description: descCriterio || undefined,
            weight: peso && !isNaN(peso) && peso > 0 ? peso : undefined,
            levels: [],
          });
        }

        const criterio = criteriaMap.get(criterioName)!;
        const descNivel = descNivelIndex !== -1 ? String(row[descNivelIndex] || '').trim() : undefined;

        // Agregar nivel al criterio
        criterio.levels.push({
          name: nivelName,
          description: descNivel || undefined,
          score: puntuacion,
        });
      }

      if (criteriaMap.size === 0) {
        throw new BadRequestException('No se encontraron datos válidos en el archivo Excel');
      }

      // Validar que cada criterio tenga al menos 2 niveles
      for (const [criterioName, criterio] of criteriaMap.entries()) {
        if (!criterio.levels || criterio.levels.length < 2) {
          throw new BadRequestException(
            `El criterio "${criterioName}" debe tener al menos 2 niveles`
          );
        }
      }

      // Convertir el mapa a array y crear el DTO
      const criteria = Array.from(criteriaMap.values()).map((c) => ({
        name: c.name,
        description: c.description,
        weight: c.weight || 1.0,
        levels: c.levels,
      }));

      const createRubricDto: CreateRubricDto = {
        name: rubricName,
        description: `Rúbrica importada desde Excel: ${file.originalname}`,
        criteria: criteria as any,
      };

      // Usar el método create existente
      return await this.create(createRubricDto, userCreatorId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al procesar archivo Excel:', error);
      throw new BadRequestException(
        `Error al procesar el archivo Excel: ${error.message || 'Error desconocido'}`
      );
    }
  }

}
