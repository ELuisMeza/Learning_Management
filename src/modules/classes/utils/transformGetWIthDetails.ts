import { NotFoundException } from "@nestjs/common";
import { ClassWithDetails, ClassWithEvaluations } from "../dto/get-clasees.dto";

export const transformGetWithDetails = (classRegister: ClassWithDetails[]): ClassWithEvaluations => {
  const classMap = new Map<string, ClassWithEvaluations>();

  classRegister.forEach((item) => {
    const classId = item.id;

    if (!classMap.has(classId)) {
      // Crear la clase base sin las propiedades de evaluación
      classMap.set(classId, {
        id: item.id,
        name: item.name,
        description: item.description,
        credits: item.credits,
        code: item.code,
        typeTeaching: item.typeTeaching,
        maxStudents: item.maxStudents,
        createdAt: item.createdAt,
        moduleName: item.moduleName,
        moduleCode: item.moduleCode,
        cycleName: item.cycleName,
        cycleCode: item.cycleCode,
        careerName: item.careerName,
        careerCode: item.careerCode,
        teacherAppellative: item.teacherAppellative,
        evaluations: [],
      });
    }

    // Agregar la evaluación al array si existe
    if (item.evaluationName) {
      const classData = classMap.get(classId)!;
      classData.evaluations.push({
        name: item.evaluationName,
        description: item.evaluationDescription || '',
        mode: item.evaluationMode || '',
      });
    }
  });

  const classData = Array.from(classMap.values())[0];
  if (!classData) {
    throw new NotFoundException('No se encontró información de la clase');  
  }
  return classData;
};