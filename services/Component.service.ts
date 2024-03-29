import { prisma } from '../lib/prisma';
import { IComponent } from '../types/Template';
import { ApiError } from '../lib/ApiError';
import TemplateService from './Template.service';
import { User } from '../types/User';

class ComponentService {
  async approveComponent(user: User, componentId: string) {
    const candidate = await this.getComponentById(componentId);
    if (!candidate) {
      throw ApiError.BadRequest(`Компонента с таким id (${componentId}) не существует`);
    }

    if (candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Этот компонент нельзя изменить');
    }

    return prisma.component.update({
      where: {
        id: componentId,
      },
      data: {
        adminId: user.id,
        approved: true,
      },
    });
  }

  async rejectComponent(user: User, componentId: string, reason?: string) {
    const candidate = await this.getComponentById(componentId);
    if (!candidate) {
      throw ApiError.BadRequest(`Компонента с таким id (${componentId}) не существует`);
    }

    if (candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Этот компонент нельзя изменить');
    }

    return prisma.component.update({
      where: {
        id: componentId,
      },
      data: {
        adminId: user.id,
        rejected: true,
        rejectReason: reason,
      },
    });
  }

  async create(user: User, componentData: Omit<IComponent, 'id'>) {
    const { data: body } = componentData;

    const { pros, cons } = body;
    if (pros.some((p) => p.trim().length < 5) || cons.some((c) => c.trim().length < 5)) {
      throw ApiError.BadRequest('Плюсы и минусы должны содержать минимум 5 символов');
    }

    const template = await TemplateService.getTemplateById(componentData.templateId);
    if (!template) {
      throw ApiError.BadRequest(`Шаблона с таким id (${componentData.templateId}) не существует`);
    }

    return prisma.component.create({
      data: {
        templateId: componentData.templateId,
        approved: user.role === 'ADMIN',
        data: componentData.data,
        creatorId: user.id,
      },
    });
  }

  async getListUnApproved(filter: { [p: string]: string | string[] | undefined }) {
    const totalCount = await prisma.component.count({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: false,
        rejected: false,
      },
    });

    let currentPage = 1;
    if (filter.page) {
      if (!Number.isNaN(filter.page)) {
        currentPage = parseInt(filter.page as string, 10);
        if (currentPage <= 0) currentPage = 1;
      }
    }

    const result = await prisma.component.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: false,
        rejected: false,
      },
    });

    return { result, currentPage, totalCount };
  }

  async getListByTemplate(
    templateId: string,
    filter: { [p: string]: string | string[] | undefined }
  ) {
    const candidate = await prisma.template.findUnique({
      where: {
        id: templateId,
      },
    });

    if (!candidate) throw ApiError.BadRequest('Такой категории не существует');

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
        data: {
          path: ['Название'],
          string_contains: filter.search,
        },
      });
    }

    let tiersFilter = {};
    if (filter.tiers && filter.tiers.length > 0) {
      const separated = (filter.tiers as string).split(' ');
      const filtered = separated.filter((item) => ['low', 'medium', 'high'].includes(item));
      const toAdd: string[] = [];
      if (filtered.some((i) => i === 'low')) toAdd.push('low');
      if (filtered.some((i) => i === 'medium')) toAdd.push('medium');
      if (filtered.some((i) => i === 'high')) toAdd.push('high');
      if (filtered.length > 0) {
        tiersFilter = Object.assign(tiersFilter, {
          OR: toAdd.map((item) => ({
            data: {
              path: 'tier',
              string_contains: item,
            },
          })),
        });
      }
    }

    const totalCount = await prisma.component.count({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: true,
        rejected: false,
        isDeleted: false,
        templateId,
        AND: [searchFilter, tiersFilter],
      },
    });

    const result = await prisma.component.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: true,
        rejected: false,
        isDeleted: false,
        templateId,
        AND: [searchFilter, tiersFilter],
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return {
      result: result.map(({ _count, reviews, ...component }) => ({
        ...component,
        totalComments: _count.comments,
        avgRating: reviews.reduce((prev, next) => prev + next.rating, 0) / (reviews.length || 1),
      })),
      currentPage,
      totalCount,
    };
  }

  async getListByUsername(
    username: string,
    filter: { [p: string]: string | string[] | undefined }
  ) {
    const candidate = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!candidate) throw ApiError.BadRequest('Такого пользователя не существует');

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
        data: {
          path: ['Название'],
          string_contains: filter.search,
        },
      });
    }

    let tiersFilter = {};
    if (filter.tiers && filter.tiers.length > 0) {
      const separated = (filter.tiers as string).split(' ');
      const filtered = separated.filter((item) => ['low', 'medium', 'high'].includes(item));
      const toAdd: string[] = [];
      if (filtered.some((i) => i === 'low')) toAdd.push('low');
      if (filtered.some((i) => i === 'medium')) toAdd.push('medium');
      if (filtered.some((i) => i === 'high')) toAdd.push('high');
      if (filtered.length > 0) {
        tiersFilter = Object.assign(tiersFilter, {
          OR: toAdd.map((item) => ({
            data: {
              path: 'tier',
              string_contains: item,
            },
          })),
        });
      }
    }

    const totalCount = await prisma.component.count({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: true,
        rejected: false,
        isDeleted: false,
        creator: {
          username,
        },
        AND: [searchFilter, tiersFilter],
      },
    });

    const result = await prisma.component.findMany({
      skip: (currentPage - 1) * 10,
      take: 10,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: true,
        rejected: false,
        isDeleted: false,
        creator: {
          username,
        },
        AND: [searchFilter, tiersFilter],
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return {
      result: result.map(({ _count, reviews, ...component }) => ({
        ...component,
        totalComments: _count.comments,
        avgRating: reviews.reduce((prev, next) => prev + next.rating, 0) / (reviews.length || 1),
      })),
      currentPage,
      totalCount,
    };
  }

  async getComponentById(componentId: string) {
    const result = await prisma.component.findUnique({
      where: {
        id: componentId,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        reviews: true,
      },
    });

    if (!result || result.isDeleted) {
      throw ApiError.BadRequest(`Компонента с таким id (${componentId}) не существует`);
    }

    const { _count, reviews, ...data } = result;
    const avgRating = reviews.reduce((prev, next) => prev + next.rating, 0) / (reviews.length || 1);

    return { ...data, totalComments: _count.comments, avgRating, reviews };
  }

  async updateComponentById(
    user: User,
    componentId: string,
    componentData: Omit<IComponent, 'id'>
  ) {
    const candidate = await this.getComponentById(componentId);

    if (!candidate || candidate.isDeleted) {
      throw ApiError.BadRequest(`Компонента с таким id (${componentId}) не существует`);
    }

    if (!candidate.approved || candidate.rejected) {
      throw ApiError.BadRequest('Этот компонент нельзя изменить');
    }

    const { pros, cons } = componentData.data;
    if (pros.some((p) => p.trim().length < 5) || cons.some((c) => c.trim().length < 5)) {
      throw ApiError.BadRequest('Плюсы и минусы должны содержать минимум 5 символов');
    }

    if (user.role === 'ADMIN') {
      return prisma.component.update({
        where: {
          id: componentId,
        },
        data: {
          data: componentData.data,
        },
      });
    }

    return prisma.updateRequest.create({
      data: {
        componentId,
        data: componentData.data,
        userId: user.id,
      },
    });
  }

  async deleteById(componentId: string) {
    const candidate = await prisma.component.findUnique({
      where: {
        id: componentId,
      },
    });

    if (!candidate || candidate.isDeleted || !candidate.approved) {
      throw ApiError.BadRequest('Такого компонента не существует');
    }

    return prisma.component.update({
      where: {
        id: componentId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}

export default new ComponentService();
