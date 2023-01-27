import { prisma } from '../lib/prisma';

class TemplateService {
  create({ name, fields }: { name: string; fields: any[] }) {
    return prisma.template.create({
      data: {
        name,
        fields,
      },
    });
  }

  getList() {
    return prisma.template.findMany({});
  }

  getFormById(id: string) {
    return prisma.template.findUnique({
      where: {
        id,
      },
    });
  }

  updateFormById({ id, data }: any) {
    return prisma.template.update({
      where: {
        id,
      },
      data,
    });
  }
}

export default new TemplateService();
