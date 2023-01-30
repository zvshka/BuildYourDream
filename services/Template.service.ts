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
