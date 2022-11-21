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

  async getList() {
    return prisma.form.findMany({});
  }
}

export default new FormService();
