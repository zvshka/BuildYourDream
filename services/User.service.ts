import { prisma } from '../lib/prisma';

class UserService {
  create({
    email,
    username,
    hashedPassword,
  }: {
    email: string;
    username: string;
    hashedPassword: string;
  }) {
    return prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
      },
    });
  }

  findOneByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  findOneByUsername(username: string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  findOneById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getList() {
    return prisma.user.findMany({
      include: {
        _count: {
          select: { configs: true },
        },
      },
    });
  }
}

export default new UserService();
