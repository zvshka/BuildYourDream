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
    const totalCount = await prisma.component.count({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        approved: true,
        rejected: false,
        templateId,
        AND: [
          {
            data: {
              path: ['Название'],
              string_contains: (filter?.search as string) || '',
            },
          },
        ],
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
        approved: true,
        rejected: false,
        templateId,
        AND: [
          {
            data: {
              path: ['Название'],
              string_contains: (filter?.search as string) || '',
            },
          },
        ],
      },
    });

    return { result, currentPage, totalCount };
  }

  async getComponentById(componentId: string) {
    const result = await prisma.component.findUnique({
      where: {
        id: componentId,
      },
    });

    if (!result) throw ApiError.BadRequest(`Компонента с таким id (${componentId}) не существует`);

    return result;
  }

  async updateComponentById(
    user: User,
    componentId: string,
    componentData: Omit<IComponent, 'id'>
  ) {
    const candidate = await this.getComponentById(componentId);

    if (!candidate) {
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
}

export default new ComponentService();
