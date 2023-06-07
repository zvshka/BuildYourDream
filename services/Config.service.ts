import { prisma } from '../lib/prisma';
import { User } from '../types/User';
import { ApiError } from '../lib/ApiError';
import ComponentService from './Component.service';
import ConstraintsService from './Constraints.service';
import { IConstraint } from '../types/Constraints';
import TemplateService from './Template.service';
import { IComponent, ITemplate } from '../types/Template';
import { configErrors } from '../lib/utils';

class ConfigService {
  async create(
    author: User,
    data: {
      title: string;
      description: string;
      components: { componentId: string; count: number }[];
    }
  ) {
    const title = data.title.trim();
    const description = data.description.trim();

    if (title.length < 5 || title.length > 50) {
      throw ApiError.BadRequest('Заголовок должен быть от 5 до 50 символов');
    }

    if (description.length < 10 || description.length > 500) {
      throw ApiError.BadRequest('Описание должно быть от 10 до 500 символов');
    }

    const componentsInstances = (await Promise.all(
      data.components.map((c) => ComponentService.getComponentById(c.componentId))
    )) as unknown as IComponent[];

    if (componentsInstances.length < data.components.length) {
      throw ApiError.BadRequest('Не все компоненты валидны');
    }

    const constraints = (await ConstraintsService.getList()) as unknown[] as IConstraint[];
    const templates = (await TemplateService.getList()) as unknown[] as ITemplate[];

    const errors = configErrors(constraints, templates, componentsInstances);

    if (errors.length > 0) throw ApiError.BadRequest('Неверная конфигурация', errors);

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
          createMany: {
            data: data.components,
          },
        },
      },
    });
  }

  async getConfigById(configId: string) {
    const candidate = await prisma.config.findUnique({
      where: {
        id: configId,
      },
      include: {
        author: true,
        components: {
          include: {
            component: true,
          },
        },
      },
    });

    if (!candidate || candidate.isDeleted) throw ApiError.BadRequest('Такой сборки не существует');

    if (candidate) {
      const price = candidate.components.reduce(
        (prev, next) => [
          prev[0] + next.component!.data!['Цена'][0],
          prev[1] + next.component!.data!['Цена'][1],
        ],
        [0, 0]
      );
      const componentsTierSummary =
        candidate.components.reduce(
          (prev, next) =>
            // @ts-ignore
            prev + next.component.data!.tier === 'low'
              ? 1
              : // @ts-ignore
              next.component.data!.tier === 'medium'
              ? 2
              : 3,
          0
        ) / candidate.components.length;
      const configTier =
        componentsTierSummary > 1 && componentsTierSummary < 1.5
          ? 'Low tier'
          : componentsTierSummary >= 1.5 && componentsTierSummary < 2.2
          ? 'Medium tier'
          : 'High tier';
      return { ...candidate, price, configTier };
    }

    throw ApiError.BadRequest('Такой сборки не существует');
  }

  async updateConfigById(
    user: User,
    configId: string,
    data: {
      title?: string;
      description?: string;
    }
  ) {
    const candidate = await prisma.config.findUnique({
      where: {
        id: configId,
      },
    });

    if (!candidate || candidate.isDeleted) throw ApiError.BadRequest('Такой сборки не существует');
    if (candidate.authorId !== user.id) throw ApiError.Forbidden();
    if (data.title && (data.title.length < 5 || data.title.length > 50)) {
      throw ApiError.BadRequest('Заголовок должен быть от 5 до 50 символов');
    }

    if (data.description && (data.description.length < 10 || data.description.length > 500)) {
      throw ApiError.BadRequest('Описание должно быть от 10 до 500 символов');
    }

    if (!data.title && !data.description) throw ApiError.BadRequest('Необходимы изменения');

    return prisma.config.update({
      where: {
        id: configId,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async getList(filter: { [p: string]: string | string[] | undefined }, user?: User) {
    let userFilter = {};
    if (filter.username && filter.username.length > 0) {
      userFilter = Object.assign(userFilter, {
        author: {
          username: filter.username,
        },
      });
    }

    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    const orderDir =
      filter.orderDir === 'desc' ? 'desc' : filter.orderDir === 'asc' ? 'asc' : 'desc';

    const orderBy:
      | { createdAt: 'desc' | 'asc' }
      | { likedUsers: { _count: 'desc' | 'asc' } }
      | { comments: { _count: 'desc' | 'asc' } } =
      filter.orderBy === 'createdAt'
        ? {
            createdAt: orderDir,
          }
        : filter.orderBy === 'liked'
        ? {
            likedUsers: {
              _count: orderDir,
            },
          }
        : filter.orderBy === 'comments'
        ? {
            comments: {
              _count: orderDir,
            },
          }
        : {
            createdAt: orderDir,
          };

    const totalCount = await prisma.config.count({
      orderBy,
      where: {
        OR: [
          {
            title: {
              contains: (filter?.search as string) || '',
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: (filter?.search as string) || '',
              mode: 'insensitive',
            },
          },
        ],
        isDeleted: false,
        ...userFilter,
      },
    });

    const result = await prisma.config.findMany({
      skip: (currentPage - 1) * 15,
      take: 15,
      orderBy,
      where: {
        OR: [
          {
            title: {
              contains: (filter?.search as string) || '',
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: (filter?.search as string) || '',
              mode: 'insensitive',
            },
          },
        ],
        isDeleted: false,
        ...userFilter,
      },
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
            likedUsers: true,
          },
        },
      },
    });

    let likedByUser;
    if (user) {
      const userData = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          likedConfigs: true,
        },
      });
      if (userData) likedByUser = userData.likedConfigs;
    }

    return {
      result: result.map(({ _count, ...config }) => ({
        ...config,
        totalComments: _count.comments,
        totalLikes: _count.likedUsers,
        liked: !likedByUser ? false : likedByUser.some((item) => item.id === config.id),
      })),
      currentPage,
      totalCount,
    };
  }

  async like(user: User, configId: string) {
    const candidate = await prisma.config.findUnique({
      where: {
        id: configId,
      },
      include: {
        likedUsers: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!candidate || candidate.isDeleted) throw ApiError.BadRequest('Такой сборки не существует');

    if (candidate.authorId === user.id) throw ApiError.BadRequest('Самолайк - залог успеха');

    const alreadyLiked = candidate.likedUsers.some((u) => u.id === user.id);

    if (alreadyLiked) throw ApiError.BadRequest('Вы не можете раз сделать это еще раз');

    return prisma.config.update({
      where: {
        id: configId,
      },
      data: {
        likedUsers: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async unlike(user: User, configId: string) {
    const candidate = await prisma.config.findUnique({
      where: {
        id: configId,
      },
      include: {
        likedUsers: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!candidate || candidate.isDeleted) throw ApiError.BadRequest('Такой сборки не существует');

    if (candidate.authorId === user.id) throw ApiError.BadRequest('Самолайк - залог успеха');

    const alreadyLiked = candidate.likedUsers.some((u) => u.id === user.id);

    if (!alreadyLiked) throw ApiError.BadRequest('Вы не можете раз сделать это еще раз');

    return prisma.config.update({
      where: {
        id: configId,
      },
      data: {
        likedUsers: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });
  }

  async deleteById(user: User, configId: string) {
    const candidate = await prisma.config.findUnique({
      where: {
        id: configId,
      },
    });
    if (!candidate || candidate.isDeleted) throw ApiError.BadRequest('Такой сборки не существует');

    if (user.role === 'USER' && user.id !== candidate.authorId) throw ApiError.Forbidden();

    return prisma.config.update({
      where: {
        id: configId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async getLikedList(user: User, filter: { [p: string]: string | string[] | undefined }) {
    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    const orderDir =
      filter.orderDir === 'desc' ? 'desc' : filter.orderDir === 'asc' ? 'asc' : 'desc';

    const orderBy:
      | { createdAt: 'desc' | 'asc' }
      | { likedUsers: { _count: 'desc' | 'asc' } }
      | { comments: { _count: 'desc' | 'asc' } } =
      filter.orderBy === 'createdAt'
        ? {
            createdAt: orderDir,
          }
        : filter.orderBy === 'liked'
        ? {
            likedUsers: {
              _count: orderDir,
            },
          }
        : filter.orderBy === 'comments'
        ? {
            comments: {
              _count: orderDir,
            },
          }
        : {
            createdAt: orderDir,
          };

    const totalCount = await prisma.config.count({
      orderBy,
      where: {
        OR: [
          {
            title: {
              contains: (filter?.search as string) || '',
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: (filter?.search as string) || '',
              mode: 'insensitive',
            },
          },
        ],
        isDeleted: false,
        likedUsers: {
          some: {
            id: user.id,
          },
        },
      },
    });

    const result = await prisma.config.findMany({
      skip: (currentPage - 1) * 15,
      take: 15,
      orderBy,
      where: {
        OR: [
          {
            title: {
              contains: (filter?.search as string) || '',
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: (filter?.search as string) || '',
              mode: 'insensitive',
            },
          },
        ],
        isDeleted: false,
        likedUsers: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
            likedUsers: true,
          },
        },
      },
    });

    return {
      result: result.map(({ _count, ...config }) => ({
        ...config,
        totalComments: _count.comments,
        totalLikes: _count.likedUsers,
        liked: true,
      })),
      currentPage,
      totalCount,
    };
  }
}

export default new ConfigService();
