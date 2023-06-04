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

  async getList(filter: Partial<{ [p: string]: string | string[] }>) {
    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    let searchFilter = {};
    if (filter.search && filter.search.length > 0) {
      searchFilter = Object.assign(searchFilter, {
        OR: [
          {
            username: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const sortDirection =
      filter.sortDirection === 'desc' ? 'desc' : filter.sortDirection === 'asc' ? 'asc' : 'desc';
    let sortObject = {};
    if (filter.sortColumn) {
      if (filter.sortColumn === 'createdAt') {
        sortObject = Object.assign(sortObject, {
          createdAt: sortDirection,
        });
      } else if (filter.sortColumn === 'totalConfigs') {
        sortObject = Object.assign(sortObject, {
          configs: {
            _count: sortDirection,
          },
        });
      } else if (filter.sortColumn === 'totalComments') {
        sortObject = Object.assign(sortObject, {
          comments: {
            _count: sortDirection,
          },
        });
      } else if (filter.sortColumn === 'totalReports') {
        sortObject = Object.assign(sortObject, {
          reports: {
            _count: sortDirection,
          },
        });
      }
    }

    const totalCount = await prisma.user.count({
      orderBy: {
        ...sortObject,
      },
      where: {
        ...searchFilter,
      },
    });

    const result = await prisma.user.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      orderBy: {
        ...sortObject,
      },
      where: {
        ...searchFilter,
      },
      include: {
        _count: {
          select: { configs: true, comments: true, myComponents: true, myReports: true },
        },
        reports: {
          where: {
            approved: true,
          },
        },
      },
    });

    return {
      result: result.map(({ _count, reports, hashedPassword, ...user }) => ({
        ...user,
        totalConfigs: _count.configs,
        totalComments: _count.comments,
        totalComponents: _count.myComponents,
        totalReports: _count.myReports,
        totalWarns: reports.reduce((prev, next) => prev + (next.warns ? next.warns : 0), 0),
      })),
      totalCount,
      currentPage,
    };
  }

  async ban(username: string) {
    const candidate = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!candidate || candidate.isBanned) {
      throw ApiError.BadRequest('Такого пользователя не существует');
    }

    return prisma.user.update({
      where: {
        username,
      },
      data: {
        isBanned: true,
      },
    });
  }

  async unban(username: string) {
    const candidate = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!candidate || !candidate.isBanned) {
      throw ApiError.BadRequest('Такого пользователя не существует');
    }

    return prisma.user.update({
      where: {
        username,
      },
      data: {
        isBanned: false,
      },
    });
  }
}

export default new UserService();
