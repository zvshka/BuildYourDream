import { prisma } from '../lib/prisma';

class TemplateService {
  create({ name, required, fields }: { name: string; required: boolean; fields: any[] }) {
    return prisma.template.create({
      data: {
        name,
        fields,
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

  getFormById(id: string) {
    return prisma.template.findUnique({
      where: {
        id,
      },
    });
  }

  updateFormById({ id, data }: { id: string; data: any }) {
    return prisma.template.update({
      where: {
        id,
      },
      data: {
        fields: data.fields,
        required: data.required,
        name: data.name,
      },
    });
  }

  updateMany(
    data: { id: string; position: number; showInConfigurator: boolean; required: boolean }[]
  ) {
    return prisma.$transaction(async (prismaBase) => {
      for (let i = 0; i < data.length; i += 1) {
        const template = data[i];
        prismaBase.template.update({
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
