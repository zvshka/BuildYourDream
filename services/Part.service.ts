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
}

export default new PartService();
