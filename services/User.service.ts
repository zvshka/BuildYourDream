import { prisma } from '../lib/prisma';
import { ApiError } from '../lib/ApiError';

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

  async findOneByUsername(username: string, noPassword?: boolean) {
    const candidate = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        configs: true,
      },
    });

    if (!candidate) throw ApiError.BadRequest('Такого пользователя не существует');

    let result;
    if (noPassword) {
      const { hashedPassword, ...data } = candidate;
      result = data;
    } else {
      result = candidate;
    }

    return result;
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
