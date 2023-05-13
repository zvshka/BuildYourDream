import { prisma } from '../lib/prisma';

class ConstraintsService {
  create(data) {
    return prisma?.constraint.create({
      data,
    });
  }

  delete(id) {
    return prisma.constraint.delete({
      where: {
        id,
      },
    });
  }

  getList() {
    return prisma?.constraint.findMany({});
  }

  update(id, data) {
    return prisma.constraint.update({
      where: {
        id,
      },
      data,
    });
  }
}

export default new ConstraintsService();
