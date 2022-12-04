import { prisma } from '../lib/prisma';

class PartService {
  create(data: any) {
    return prisma.component.create({
      data,
    });
  }

  getListByForm(formId: string) {
    return prisma.component.findMany({
      where: {
        formId,
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

export default new PartService();
