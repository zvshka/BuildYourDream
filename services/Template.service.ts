import { JsonArray, JsonObject } from 'type-fest';
import { prisma } from '../lib/prisma';
import { IField } from '../types/Field';
import { ApiError } from '../lib/ApiError';
import { ITemplate } from '../types/Template';
import { User } from '../types/User';

class TemplateService {
  create({
    name,
    required = false,
    fields,
  }: {
    name: string;
    required: boolean;
    fields: IField[];
  }) {
    if (!name || name.length < 3) throw ApiError.BadRequest('Не верно введено название');

    return prisma.template.create({
      data: {
        name,
        fields: fields as unknown as JsonArray,
        required,
      },
    });
  }

  getList() {
    return prisma.template.findMany({
      orderBy: {
        position: 'asc',
      },
    });
  }

  getTemplateById(id: string) {
    return prisma.template.findUnique({
      where: {
        id,
      },
    });
  }

  async updateTemplateById(user: User, { id, data }: { id: string; data: ITemplate }) {
    const candidate = await this.getTemplateById(id);
    if (!candidate) throw ApiError.BadRequest(`Шаблона с таким id (${id}) не существует`);
    if (!data.name || data.name.length < 3) throw ApiError.BadRequest('Не верно введено название');

    if (user.role === 'ADMIN') {
      return prisma.template.update({
        where: {
          id,
        },
        data: {
          fields: data.fields as unknown as JsonArray,
          required: data.required,
          name: data.name,
        },
      });
    }

    return prisma.updateRequest.create({
      data: {
        templateId: id,
        data: data as unknown as JsonObject,
        userId: user.id,
      },
    });
  }

  updateMany(
    data: { id: string; position: number; showInConfigurator: boolean; required: boolean }[]
  ) {
    return prisma.$transaction(async (prismaBase) => {
      for (let i = 0; i < data.length; i += 1) {
        const template = data[i];
        // eslint-disable-next-line no-await-in-loop
        await prismaBase.template.update({
          where: {
            id: template.id,
          },
          data: {
            position: template.position,
            showInConfigurator: template.showInConfigurator,
            required: template.required,
          },
        });
      }
    });
  }
}

export default new TemplateService();
