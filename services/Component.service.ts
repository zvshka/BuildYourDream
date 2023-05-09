import { prisma } from '../lib/prisma';

class ComponentService {
  create(data: any) {
    return prisma.component.create({
      data,
    });
  }

  getListByTemplate(templateId: string, filter: any) {
    return prisma.component.findMany({
      where: {
        templateId,
        AND: [
          {
            data: {
              path: ['Название'],
              string_contains: filter?.search || '',
            },
          },
        ],
      },
    });
  }

  getPartById(partId: string) {
    return prisma.component.findUnique({
      where: {
        id: partId,
      },
    });
  }

  updatePartById(partId: string, data: any) {
    return prisma.component.update({
      where: {
        id: partId,
      },
      data,
    });
  }
}

export default new ComponentService();
