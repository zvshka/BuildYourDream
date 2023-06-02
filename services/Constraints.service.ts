import { prisma } from '../lib/prisma';
import { IConstraintFieldValue } from '../types/Constraints';
import TemplateService from './Template.service';
import { ApiError } from '../lib/ApiError';
import { ITemplate } from '../types/Template';

class ConstraintsService {
  async create(constraintData: { id: string; data: IConstraintFieldValue }) {
    const { leftSide, rightSide, constraint } = constraintData.data;
    if (
      !leftSide.componentId ||
      !leftSide.fieldId ||
      !rightSide.componentId ||
      !rightSide.fieldId
    ) {
      throw ApiError.BadRequest('Один или несколько парметров отсутствуют');
    }

    const leftCandidate = (await TemplateService.getTemplateById(
      leftSide.componentId
    )) as unknown as ITemplate | null;

    const rightCandidate = (await TemplateService.getTemplateById(
      rightSide.componentId
    )) as unknown as ITemplate | null;

    if (!leftCandidate || !rightCandidate) {
      throw ApiError.BadRequest('Один или несколько парметров не существуют');
    }

    if (
      leftCandidate.fields.every((f) => f.id !== leftSide.fieldId) ||
      rightCandidate.fields.every((f) => f.id !== rightSide.fieldId)
    ) {
      throw ApiError.BadRequest('Один или несколько парметров не существуют');
    }

    return prisma.constraint.create({
      data: {
        data: {
          leftSide: {
            componentId: leftSide.componentId,
            fieldId: leftSide.fieldId,
          },
          rightSide: {
            componentId: rightSide.componentId,
            fieldId: rightSide.fieldId,
          },
          constraint,
        },
      },
    });
  }

  async delete(id: string) {
    const candidate = await prisma.constraint.findUnique({
      where: {
        id,
      },
    });

    if (!candidate) throw ApiError.BadRequest(`Ограничения с таким id (${id}) не существует`);

    return prisma.constraint.delete({
      where: {
        id,
      },
    });
  }

  getList() {
    return prisma.constraint.findMany({});
  }

  async update(id: string, constraintData: IConstraintFieldValue) {
    const { leftSide, rightSide, constraint } = constraintData;
    if (
      !leftSide.componentId ||
      !leftSide.fieldId ||
      !rightSide.componentId ||
      !rightSide.fieldId
    ) {
      throw ApiError.BadRequest('Один или несколько парметров отсутствуют');
    }

    const leftCandidate = (await TemplateService.getTemplateById(
      leftSide.componentId
    )) as unknown as ITemplate | null;

    const rightCandidate = (await TemplateService.getTemplateById(
      rightSide.componentId
    )) as unknown as ITemplate | null;

    if (!leftCandidate || !rightCandidate) {
      throw ApiError.BadRequest('Один или несколько парметров не существуют');
    }

    if (
      leftCandidate.fields.every((f) => f.id !== leftSide.fieldId) ||
      rightCandidate.fields.every((f) => f.id !== rightSide.fieldId)
    ) {
      throw ApiError.BadRequest('Один или несколько парметров не существуют');
    }
    return prisma.constraint.update({
      where: {
        id,
      },
      data: {
        data: {
          leftSide: {
            componentId: leftSide.componentId,
            fieldId: leftSide.fieldId,
          },
          rightSide: {
            componentId: rightSide.componentId,
            fieldId: rightSide.fieldId,
          },
          constraint,
        },
      },
    });
  }
}

export default new ConstraintsService();
