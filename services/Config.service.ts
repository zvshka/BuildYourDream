import { prisma } from '../lib/prisma';
import { User } from '../types/User';
import { ApiError } from '../lib/ApiError';
import ComponentService from './Component.service';

class ConfigService {
  async create(author: User, data: { title: string; description: string; components: string[] }) {
    const title = data.title.trim();
    const description = data.description.trim();

    if (title.length < 5 || title.length > 50) {
      throw ApiError.BadRequest('Заголовок должен быть от 5 до 50 символов');
    }

    if (description.length < 10 || description.length > 500) {
      throw ApiError.BadRequest('Описание должно быть от 10 до 500 символов');
    }

    const componentsCheck = await Promise.all(
      data.components.map((c) => ComponentService.getComponentById(c))
    );

    if (componentsCheck.length < data.components.length) {
      throw ApiError.BadRequest('Не все компоненты валидны');
    }

    return prisma.config.create({
      data: {
        title,
        description,
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

  async getConfigById(configId: string) {
    return prisma.config.findUnique({
      where: {
        id: configId,
      },
      include: {
        author: true,
        components: true,
      },
    });
  }

  async getList(filter: { [p: string]: string | string[] | undefined }) {
    const totalCount = await prisma.config.count({
      //TODO: Add more filters
      orderBy: {
        createdAt: 'desc',
      },
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
      orderBy: {
        createdAt: 'desc',
      },
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
