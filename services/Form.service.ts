import { prisma } from '../lib/prisma';

class FormService {
  create({ name, fields }: any) {
    return prisma.form.create({
      data: {
        name,
        fields,
      },
    });
  }

  getList() {
    return prisma.form.findMany({});
  }

  getFormById(id: string) {
    return prisma.form.findUnique({
      where: {
        id,
      },
    });
  }

  updateFormById({ id, data }: any) {
    return prisma.form.update({
      where: {
        id,
      },
      data,
    });
  }
}

export default new FormService();
