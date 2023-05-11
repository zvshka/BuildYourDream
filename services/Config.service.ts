import { prisma } from '../lib/prisma';
import { User } from '../types/User';

class ConfigService {
  create(author: User, data: { title: string; description: string; components: string[] }) {
    return prisma.config.create({
      data: {
        title: data.title,
        description: data.description,
        author: {
          connect: {
            id: author.id,
          },
        },
        components: {
          connect: data.components.map((id) => ({ id })),
        },
      },
    });
  }

  async getList(filter: { [p: string]: string | string[] | undefined }) {
    const totalCount = await prisma.config.count({
      //TODO: Add more filters
      where: {
        title: {
          contains: (filter?.search as string) || '',
        },
      },
    });

    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    const result = await prisma.config.findMany({
      skip: (currentPage - 1) * 15,
      take: 15,
      where: {
        title: {
          contains: (filter?.search as string) || '',
        },
      },
      include: {
        author: true,
      },
    });

    return { result, currentPage, totalCount };
  }
}

export default new ConfigService();
